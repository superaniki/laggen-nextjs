import { StaveCurveConfigWithData, StaveEndConfigWithData, StaveFrontConfigWithData } from '@/db/queries/barrels';
import { BarrelDetails, StaveEndConfigDetails } from '@prisma/client';
import { Paper } from '@/common/enums';
import {
	createCurveForStaveEnds,
	createCurveMaxWidth,
	findAdjustedDiameter,
} from '@/components/barrels/canvas/commons/barrel-math';
import * as PImage from 'pureimage';

function drawPath(ctx: PImage.Context, x: number, y: number, points: number[], closed = false, useFill = false) {
	// Draw the line
	ctx.beginPath();
	ctx.moveTo(points[0] + x, points[1] + y); // Move to the first point

	// Iterate over the vector and draw line segments
	for (var i = 2; i < points.length; i += 2) {
		ctx.lineTo(points[i] + x, points[i + 1] + y); // Draw line to next point
	}
	if (closed) {
		ctx.lineTo(points[0] + x, points[1] + y); // Draw to the first point
	}

	if (useFill) {
		ctx.fill();
	} else {
		ctx.stroke();
	}
}

function drawCurve(x: number, y: number, ctx: PImage.Context, points: number[], title: string) {
	drawPath(ctx, x, y, points);
	ctx.fillStyle = 'black';
	ctx.font = "6pt 'Liberation'";
	ctx.strokeStyle = 'black';
	ctx.fillText(title, x + 4.5, y - 6);
}

export function drawBarrelSideCTX(
	ctx: PImage.Context,
	x: number,
	y: number,
	barrelDetails: BarrelDetails,
	scale: number
) {
	const { angle, height, bottomDiameter, staveTopThickness, staveBottomThickness, bottomThickness, bottomMargin } = {
		...barrelDetails,
	};

	const tan = Math.tan((angle * Math.PI) / 180);
	const length = tan * height; // position till motsatt sida av vinkeln
	const hypotenusaLength = Math.sqrt(height * height + length * length);
	const outlinePoints = [0, 0, -length, -height, bottomDiameter + length, -height, bottomDiameter, 0];
	const leftStavePoints = [0, 0, 0, -hypotenusaLength, staveTopThickness, -hypotenusaLength, staveBottomThickness, 0];
	const rightStavePoints = [
		0,
		0,
		0,
		-hypotenusaLength,
		-staveTopThickness,
		-hypotenusaLength,
		-staveBottomThickness,
		0,
	];
	const angleLength = tan * bottomMargin - (staveBottomThickness - 5); // angle-dependent extra length to plate
	const bottomPlantePoints = [
		0 + angleLength,
		0,
		0 + angleLength,
		-bottomThickness,
		-bottomDiameter - angleLength,
		-bottomThickness,
		-bottomDiameter - angleLength,
		0,
	];

	ctx.translate(x, y);
	ctx.lineWidth = 1;
	ctx.scale(scale, scale);
	drawPath(ctx, -bottomDiameter - length, 0, outlinePoints);
	ctx.save();
	ctx.translate(-bottomDiameter - length, 0);
	ctx.rotate((-angle * Math.PI) / 180.0);
	drawPath(ctx, 0, 0, leftStavePoints);
	ctx.restore();

	ctx.save();
	ctx.translate(-length, 0);
	ctx.rotate((angle * Math.PI) / 180.0);
	drawPath(ctx, 0, 0, rightStavePoints);
	ctx.restore();

	drawPath(ctx, -length, -bottomMargin, bottomPlantePoints);
}

function generateHorizontalCentimeters(
	ctx: PImage.Context,
	x: number,
	y: number,
	number: number,
	length: number,
	scale: number,
	margin: number
) {
	Array.from(Array(number)).map((val, index) => {
		const extraLength = Number.isInteger(index / 5) ? 6 : 0;
		drawPath(ctx, x, y, [index * scale, -margin, index * scale, -margin + length + extraLength]);
		if (extraLength) {
			ctx.fillStyle = 'black';
			ctx.font = "4pt 'Liberation'";
			ctx.strokeStyle = 'black';
			ctx.fillText(String(index), x + 2 + index * scale, y - 6);
		}
	});
}

export function drawRulerCTX(
	ctx: PImage.Context,
	scale: number,
	x: number,
	y: number,
	xLength: number | string,
	yLength: number | string,
	margin: number,
	width: number = 100,
	height: number = 100
) {
	const pointWidth = Number(xLength == 'max' ? width - margin : xLength);
	const pointHeight = Number(yLength == 'max' ? -height + margin : yLength);
	ctx.strokeStyle = 'black';
	ctx.fillStyle = 'white';
	ctx.fillRect(x, y, pointWidth * scale, margin); // horisontell, 10,
	ctx.lineWidth = 1;
	drawPath(ctx, x, y, [0, 0, pointWidth * scale, 0]);
	generateHorizontalCentimeters(ctx, x, y + margin, pointWidth, 3, scale, margin);
}

export function drawInfoTextCTX(ctx: PImage.Context, text: string, angle: number, posx: number, posy: number) {
	ctx.font = "3pt 'Liberation'";
	ctx.fillStyle = 'black';
	ctx.save();
	ctx.rotate((angle * Math.PI) / 180.0);
	ctx.fillText(text, posx, posy);
	ctx.restore();
}

export function drawStaveCurveCTX(
	ctx: PImage.Context,
	paperState: Paper,
	barrelDetails: BarrelDetails,
	config: StaveCurveConfigWithData,
	maxStaveWidth = 100
) {
	const { height, angle, bottomDiameter, staveBottomThickness, staveTopThickness } = { ...barrelDetails };

	const configDetailsArray = config.configDetails;

	const configDetails = configDetailsArray.find((item) => item.paperType === paperState);
	if (configDetails === undefined) return ctx;

	const { posX, posY, innerTopY, outerTopY, innerBottomY, outerBottomY, rectX, rectY, rectWidth, rectHeight } = {
		...configDetails,
	};

	const tan = Math.tan((angle * Math.PI) / 180);
	const length = tan * height; // position till motsatt sida av vinkeln
	const topOuterDiameter = length * 2 + bottomDiameter;
	const bottomOuterDiameter = bottomDiameter;

	const adjustedBottomOuterDiameter = findAdjustedDiameter(bottomOuterDiameter, angle);
	const adjustedBottomInnerDiameter = adjustedBottomOuterDiameter - staveBottomThickness * 2;
	const adjustedTopOuterDiameter = findAdjustedDiameter(topOuterDiameter, angle);
	const adjustedTopInnerDiameter = adjustedTopOuterDiameter - staveTopThickness * 2;

	const adjustedBottomOuterPoints = createCurveMaxWidth(adjustedBottomOuterDiameter, 90, 180, maxStaveWidth);
	const adjustedBottomInnerPoints = createCurveMaxWidth(adjustedBottomInnerDiameter, 90, 180, maxStaveWidth);
	const adjustedTopOuterPoints = createCurveMaxWidth(adjustedTopOuterDiameter, 90, 180, maxStaveWidth);
	const adjustedTopInnerPoints = createCurveMaxWidth(adjustedTopInnerDiameter, 90, 180, maxStaveWidth);

	const curveXpos = rectX + rectWidth;

	ctx.save();
	ctx.translate(posX, posY);
	ctx.fillStyle = 'black';
	ctx.font = "6pt 'Liberation'";
	ctx.lineWidth = 4;
	ctx.strokeStyle = 'black';

	drawCurve(curveXpos, outerBottomY, ctx, adjustedBottomOuterPoints, 'Bottom, outer');
	drawCurve(curveXpos, innerBottomY, ctx, adjustedBottomInnerPoints, 'Bottom, inner');
	drawCurve(curveXpos, outerTopY, ctx, adjustedTopOuterPoints, 'Top, outer');
	drawCurve(curveXpos, innerTopY, ctx, adjustedTopInnerPoints, 'Top, inner');

	ctx.rect(rectX, rectY, rectWidth, rectHeight);
	ctx.stroke();
	ctx.restore();
}

function reversePairs(arr: number[]) {
	return arr.map((_, i) => arr[arr.length - i - 2 * (1 - (i % 2))]);
}

export function drawStaveEndsCTX(
	ctx: PImage.Context,
	x: number,
	y: number,
	barrelDetails: BarrelDetails,
	config: StaveEndConfigWithData,
	paperState: Paper
) {
	const { angle, height, bottomDiameter, staveBottomThickness, staveTopThickness } = { ...barrelDetails };
	const configDetailsArray = config.configDetails;

	const configDetails = configDetailsArray.find((item) => item.paperType === paperState);
	if (configDetails === undefined) return ctx;

	const tan = Math.tan((angle * Math.PI) / 180);
	const length = tan * height; // position till motsatt sida av vinkeln
	const topOuterDiameter = length * 2 + bottomDiameter;
	const bottomOuterDiameter = bottomDiameter;

	const adjustedBottomOuterDiameter = findAdjustedDiameter(bottomOuterDiameter, angle);
	const adjustedBottomInnerDiameter = adjustedBottomOuterDiameter - staveBottomThickness * 2;
	const adjustedTopOuterDiameter = findAdjustedDiameter(topOuterDiameter, angle);
	const adjustedTopInnerDiameter = adjustedTopOuterDiameter - staveTopThickness * 2;

	const bottomPoints = createCurveForStaveEnds(adjustedBottomInnerDiameter, 90, 270, staveBottomThickness);
	const bottomEndPoints = [
		...createCurveForStaveEnds(adjustedBottomOuterDiameter, 90, 270, 0),
		...reversePairs(bottomPoints),
	];

	const topPoints = createCurveForStaveEnds(adjustedTopInnerDiameter, 90, 270, staveTopThickness);
	const topEndPoints = [...createCurveForStaveEnds(adjustedTopOuterDiameter, 90, 270, 0), ...reversePairs(topPoints)];

	ctx.fillStyle = 'black';
	ctx.font = "6pt 'Liberation'";
	ctx.lineWidth = 4;
	ctx.strokeStyle = 'black';

	ctx.save();
	ctx.translate(x, y);
	drawPath(ctx, 0, configDetails.topEndY, topEndPoints, true);
	ctx.fillText('Top Ends', 4.5, configDetails.topEndY - 4);
	drawPath(ctx, 0, configDetails.bottomEndY, bottomEndPoints, true);
	ctx.fillText('Bottom Ends', 4.5, configDetails.bottomEndY - 4);
	ctx.restore();
}

type TextData = {
	x: number;
	y: number;
	text: string;
};

function calcStaveTemplatePoints(topDiameter: number, bottomDiameter: number, staveLength: number, spacing: number) {
	const mmPerSizeChange = spacing;
	const mmPerSizeChangeBottom = (bottomDiameter / topDiameter) * mmPerSizeChange;
	const points = [];
	const textData = [];

	let diaBottom = bottomDiameter;
	let count = 1;

	for (let diaTop = topDiameter; diaTop >= 0 && diaBottom >= 0; diaTop -= mmPerSizeChange) {
		points.push([-diaBottom * 0.5, 0, -diaTop * 0.5, -staveLength, diaTop * 0.5, -staveLength, diaBottom * 0.5, 0]);
		textData.push({ x: -diaTop * 0.5, y: -staveLength, text: String(count) });
		textData.push({ x: diaTop * 0.5, y: -staveLength, text: String(count) });
		count++;
		diaBottom -= mmPerSizeChangeBottom;
	}
	return { points: points, textData: textData };
}

export function drawStaveFrontCTX(
	ctx: PImage.Context,
	x: number,
	y: number,
	barrelDetails: BarrelDetails,
	config: StaveFrontConfigWithData,
	paperState: Paper
) {
	const { bottomDiameter, topDiameter, staveLength } = { ...barrelDetails };
	const configDetailsArray = config.configDetails;

	const configDetails = configDetailsArray.find((item) => item.paperType === paperState);
	if (configDetails === undefined) return ctx;

	const { posY, spacing } = { ...configDetails };
	const pointsData = calcStaveTemplatePoints(topDiameter, bottomDiameter, staveLength, spacing);

	ctx.strokeStyle = 'black';
	ctx.fillStyle = 'black';
	ctx.lineWidth = 3;

	ctx.save();
	ctx.translate(x, posY);
	ctx.fillStyle = 'lightgrey';
	drawPath(ctx, 0, 0, pointsData.points[0], true, true);
	pointsData.points.forEach((element) => {
		drawPath(ctx, 0, 0, element, true);
	});
	ctx.fillStyle = 'black';
	ctx.font = "4pt 'Liberation'";
	pointsData.textData.forEach((element) => {
		ctx.fillText(element.text, element.x - 3, element.y - 6);
	});
	ctx.restore();
}
