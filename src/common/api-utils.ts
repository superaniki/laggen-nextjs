import { StaveCurveConfigWithData } from "@/db/queries/barrels";
import { BarrelDetails } from "@prisma/client";
import { Paper } from "./enums";
import { createCurveMaxWidth, findAdjustedDiameter } from "@/components/canvas/commons/barrel-math";
import * as PImage from "pureimage";

type ToolCurveProps = {
	ctx:PImage.Context
	id: string;
	x: number;
	y: number;
	points: number[];
	title: string;
	closed?: boolean;
};

function drawPath(x :number, y : number, ctx :PImage.Context,points: number[]){
	// Draw the line
	ctx.beginPath();
	ctx.moveTo(points[0]+x, points[1]+y); // Move to the first point

	// Iterate over the vector and draw line segments
	for (var i = 2; i < points.length; i += 2) {
		ctx.lineTo(points[i]+x, points[i + 1]+y); // Draw line to next point
	}

	// Set line style and stroke
	ctx.lineWidth = 2;
	ctx.strokeStyle = 'black';
	ctx.stroke();
}

function Curve( ctx :PImage.Context, id :string, x :number, y:number, points: number[], title: string, closed :boolean = false) {

	drawPath(x,y,ctx,points);

	/*
	return (
		<Group id={id} x={x} y={y} draggable>
			<Line closed={closed} points={points} stroke={'black'} strokeWidth={1} />
			<Text x={4.5} y={-10} text={title} fontSize={8} fill={'black'} />
		</Group>
	);*/
}


function StaveCurveCTX( ctx : PImage.Context, paperState : Paper, barrelDetails:BarrelDetails, config:StaveCurveConfigWithData, 
	scale : number, maxStaveWidth = 100) {
	const { height, angle, bottomDiameter, staveBottomThickness, staveTopThickness } = { ...barrelDetails };

	const configDetailsArray = config.configDetails;

	const configDetails = configDetailsArray.find(item => (item.paperType === paperState));
	if (configDetails === undefined)
		return ctx;

	const { posX, posY, innerTopY, outerTopY, innerBottomY,
		outerBottomY, rectX, rectY, rectWidth, rectHeight } = { ...configDetails }

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

	ctx.translate(posX,posY);
	ctx.scale(scale,scale);

	drawPath(curveXpos,outerBottomY,ctx,adjustedBottomOuterPoints);
	drawPath(curveXpos,innerBottomY,ctx,adjustedBottomInnerPoints);
	drawPath(curveXpos,outerTopY,ctx,adjustedTopOuterPoints);
	drawPath(curveXpos,innerTopY,ctx,adjustedTopInnerPoints);

	ctx.strokeStyle = 'black';
	ctx.lineWidth = 1; // Set the line width if you're using strokeRect()
	ctx.fillStyle = "black";
	ctx.fillRect(rectX, rectY, rectWidth, rectHeight);


/*
	return (
		<Group x={posX} y={posY} draggable scale={{ x: scale, y: scale }}>
			<Curve id={"innerTopY"} x={curveXpos} y={innerTopY} points={adjustedTopInnerPoints} title={'Top, inner!'} />
			<Curve id={"outerTopY"} x={curveXpos} y={outerTopY} points={adjustedTopOuterPoints} title={'Top, outer'} />
			<Curve id={"innerBottomY"} x={curveXpos} y={innerBottomY} points={adjustedBottomInnerPoints} title={'Bottom, inner'} />
			<Curve id={"outerBottomY"} x={curveXpos} y={outerBottomY} points={adjustedBottomOuterPoints} title={'Bottom, outer'} />
			<Rect id="rect" stroke={'black'} strokeWidth={1} fill="white" x={rectX} y={rectY} width={rectWidth} height={rectHeight} />
		</Group>
	);
	*/
}


export default StaveCurveCTX;