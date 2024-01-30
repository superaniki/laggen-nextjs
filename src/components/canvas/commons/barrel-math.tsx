import { Barrel } from "@prisma/client";

function findDiameter(oldDiameter: number, x2: number, y2: number) {
	const diameterStep = 0.1;
	let testDiameter = oldDiameter;
	let foundAngle = 0;
	let yTest = -oldDiameter * Math.cos((Math.PI * 2 * 180) / 360);

	let count = 0; // Leta reda på angle där omkrets-x med ny diameter går förbi den nya slutpositionen

	while (yTest > y2 && yTest > 0 && count < 10000) {
		count++;
		let xTest = 0;
		for (let i = 180; i > 90; i--) {
			// Hitta närmsta x-position
			xTest = testDiameter * 0.5 * Math.sin((Math.PI * 2 * i) / 360);
			if (xTest >= x2) {
				foundAngle = i;
				break;
			}
		}
		// räkna ut yvärdet. Har det minska nog för att vara mindre än y2?
		yTest = testDiameter * 0.5 * Math.cos((Math.PI * 2 * foundAngle) / 360) + testDiameter * 0.5;
		if (yTest < y2) {
			break;
		}
		testDiameter += diameterStep;
	}
	return testDiameter;
}

function calcCirclePosition(radius: number, angle: number, yAdjust: number) {
	const x = radius * Math.sin((Math.PI * 2 * angle) / 360);
	const y = radius * Math.cos((Math.PI * 2 * angle) / 360);
	return [Number(parseFloat(String(x)).toFixed(8)), Number(parseFloat(String(y + yAdjust)).toFixed(8))];
}

function getCorrectedEndPoints(points: number[], angle: number) {
	const procentToRemove = 100 * Math.sin((Math.PI * 2 * angle) / 360) * 0.01;
	const x = points[points.length - 2];
	const y = points[points.length - 1] - points[points.length - 1] * procentToRemove;
	return [x, y];
}

function findAdjustedDiameter(diameter: number, angle: number) {
	const points = createCurveMaxWidth(diameter, 90, 180);
	const adjustedEndPoints = getCorrectedEndPoints(points, angle);
	return findDiameter(diameter, adjustedEndPoints[0], adjustedEndPoints[1]);
}

function createCurveMaxWidth(diameter: number, min: number, max: number, maxStaveWidth = 999999) {
	const radius = diameter * 0.5;
	const points = [];
	for (let i = max; i >= min; i--) {
		points.push(...calcCirclePosition(radius, i, radius));
		if (points[points.length - 2] > maxStaveWidth) break;
	}
	return points;
}

function createCurveForStaveEnds(diameter: number, min: number, max: number, adjust: number) {
	const radius = diameter * 0.5;
	const points = [];
	for (let i = max; i >= min; i--) {
		points.push(...calcCirclePosition(radius, i, radius + adjust));
	}
	return points;
}

function hypoCalc(_height: number, _adjacent: number) {
	return Math.sqrt(_height * _height + _adjacent * _adjacent);
}

function calcStaveLength(_angle: number, _height: number) {
	const tan = parseFloat(String(Math.tan(toRadians(_angle))));
	const adjacent = parseFloat(String(tan * _height)); // längd för motsatt sida av vinkeln
	const hypotenusaLength = hypoCalc(_height, adjacent);
	return hypotenusaLength;
}

function toRadians(angle: number) {
	return (angle * Math.PI) / 180;
}

function calcBarrelHeight(angle: number, staveLength: number) {
	return Math.cos(toRadians(angle)) * staveLength; // staveHeight = hypotenusa
}

function calculateAngle(_topDiameter: number, _bottomDiameter: number, _height: number) {
	const adjacent = (_topDiameter - _bottomDiameter) * 0.5;
	const hypotenusa = hypoCalc(_height, adjacent);
	return Math.asin(adjacent / hypotenusa) * (180 / Math.PI);
}

function round(value: number, numberOfDecimals = 2) {
	return Math.round(value * Math.pow(10, numberOfDecimals)) / Math.pow(10, numberOfDecimals);
}

// Utility function for editor input --------------------
function applyBarrelHeight(newHeight: number, barrel: Barrel) {
	const newAngle = calculateAngle(barrel.topDiameter, barrel.bottomDiameter, newHeight);
	const tan = parseFloat(String(Math.tan(toRadians(newAngle))));
	const adjacent = parseFloat(String(tan * newHeight)); // längd för motsatt sida av vinkeln
	const hypotenusaLength = hypoCalc(newHeight, adjacent);

	return { ...barrel, staveLength: round(hypotenusaLength), height: newHeight, angle: round(newAngle) };
}

function applyBarrelStaveLength(newStaveLength: number, barrel: Barrel, topDiameterLocked: boolean = false) {
	if (barrel.angle === undefined || barrel.staveLength === undefined) return barrel;

	const newAdjacent = newStaveLength * Math.sin(toRadians(barrel.angle));
	const newHeight = newStaveLength * Math.cos(toRadians(barrel.angle));

	if (topDiameterLocked) {
		const oldAdjacent = barrel.staveLength * Math.sin(toRadians(barrel.angle));
		const diff = oldAdjacent - newAdjacent;
		const newBottomDiameter = round(barrel.bottomDiameter + diff * 2);

		return { ...barrel, staveLength: newStaveLength, height: newHeight, bottomDiameter: newBottomDiameter };
	}

	const newTopDiameter = round(barrel.bottomDiameter + newAdjacent * 2);
	return { ...barrel, staveLength: newStaveLength, height: newHeight, topDiameter: newTopDiameter };
}

function applyBarrelBottomDiameter(newBottomDiameter: number, barrel: Barrel) {
	const newAngle = round(calculateAngle(barrel.topDiameter, newBottomDiameter, barrel.height), 2);
	const newStaveLength = round(calcStaveLength(newAngle, barrel.height), 2);

	return { ...barrel, staveLength: newStaveLength, angle: newAngle, bottomDiameter: newBottomDiameter };
}

function applyBarrelTopDiameter(newTopDiameter: number, barrel: Barrel) {
	const newAngle = round(calculateAngle(newTopDiameter, barrel.bottomDiameter, barrel.height));
	const newStaveLength = round(calcStaveLength(newAngle, barrel.height));

	return { ...barrel, staveLength: newStaveLength, angle: newAngle, topDiameter: newTopDiameter };
}

function applyBarrelAngle(newAngle: number, barrel: Barrel, topDiameterLocked?: boolean) {
	//console.log('top diameter locked');

	const newHeight = calcBarrelHeight(newAngle, barrel.staveLength);
	const tan = Math.tan(newAngle * (Math.PI / 180));
	const newAdjacent = tan * newHeight; // position till motsatt sida av vinkeln
	const oldAdjacent = barrel.staveLength * Math.sin(toRadians(barrel.angle));
	const diff = oldAdjacent - newAdjacent;
	const newBottomDiameter = barrel.bottomDiameter + diff * 2;
	const updatedDiameter = { bottomDiameter: newBottomDiameter };
	const newBarrel = { ...barrel, angle: newAngle, height: newHeight, ...updatedDiameter };
	return newBarrel;
}

function findScaleToFit(
	/**
	 * Returns scaled points to fit object within view with optional margin
	 *
	 * @param view - the view to fit the object withing
	 * @param object - The object to fit inside the view
	 * @param margins - optional margins, in percent (0.8) = cover 80% of the view
	 * @returns scale to use for optimal fit
	 * */

	view: { width: number; height: number },
	object: { width: number; height: number },
	margins: number
): number {
	let scale = 1;
	if (object.width > view.width || object.height > view.height) {
		/// new barrel = (ytan * maxSize / barrel) * barrel= multi med barrel!
		const scaleWidth = (margins * view.width) / object.width;
		const scaleHeight = (margins * view.height) / object.height;
		scale = scaleHeight > scaleWidth ? scaleWidth : scaleHeight;
	} else {
		const scaleWidth = (margins * view.width) / object.width;
		const scaleHeight = (margins * view.height) / object.height;
		scale = scaleHeight > scaleWidth ? scaleWidth : scaleHeight;
	}
	return scale;
}

export {
	round,
	findAdjustedDiameter,
	createCurveMaxWidth,
	createCurveForStaveEnds,
	calcStaveLength,
	toRadians,
	calcBarrelHeight,
	calculateAngle,
	applyBarrelHeight,
	applyBarrelStaveLength,
	applyBarrelBottomDiameter,
	applyBarrelTopDiameter,
	applyBarrelAngle,
	findScaleToFit,
};
