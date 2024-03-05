import { StaveCurveConfigWithData } from "@/db/queries/barrels";
import { BarrelDetails } from "@prisma/client";
import { Paper } from "./enums";
import { createCurveMaxWidth, findAdjustedDiameter } from "@/components/canvas/commons/barrel-math";
import * as PImage from "pureimage";
import { Line } from "react-konva";
import { LinearGradient } from "pureimage/dist/gradients";

type ToolCurveProps = {
	ctx:PImage.Context
	id: string;
	x: number;
	y: number;
	points: number[];
	title: string;
	closed?: boolean;
};

function drawPath(ctx :PImage.Context, x :number, y : number, points: number[]){
	// Draw the line
	ctx.beginPath();
	ctx.moveTo(points[0]+x, points[1]+y); // Move to the first point

	// Iterate over the vector and draw line segments
	for (var i = 2; i < points.length; i += 2) {
		ctx.lineTo(points[i]+x, points[i + 1]+y); // Draw line to next point
	}

	// Set line style and stroke
	ctx.stroke();
}
function drawCurve(x :number, y : number, ctx :PImage.Context,points: number[], title : string){
		
	drawPath(ctx,x,y,points);
	ctx.fillStyle = "black";
	ctx.font = "6pt 'Liberation'";
	ctx.strokeStyle = 'black';
  ctx.fillText(title, x+4.5, y-6);
}

	/*
	return (
		<Group id={id} x={x} y={y} draggable>
			<Line closed={closed} points={points} stroke={'black'} strokeWidth={1} />
			<Text x={4.5} y={-10} text={title} fontSize={8} fill={'black'} />
		</Group>
	);*/




	function generateHorizontalCentimeters(ctx: PImage.Context, x: number, y: number, number: number, length: number, scale: number, margin:number) {
		Array.from(Array(number)).map((val, index) => {
			const extraLength = Number.isInteger(index / 5) ? 6 : 0;
			drawPath(ctx,x,y,[index * scale, -margin, index * scale, -margin + length + extraLength]);
			if(extraLength){
				ctx.fillStyle = "black";
				ctx.font = "4pt 'Liberation'";
				ctx.strokeStyle = 'black';
				ctx.fillText(String(index), x + 2 + index * scale, y - 6);
			}
		});
	}


export function drawRulerCTX(ctx: PImage.Context, scale: number, x:number, y:number, xLength:number | string, yLength:number | string, 
	margin:number,  width : number = 100, height: number = 100){

	const pointWidth = Number(xLength == 'max' ? width - margin : xLength);
	const pointHeight = Number(yLength == 'max' ? -height + margin : yLength);
	ctx.fillStyle = "white";
	ctx.fillRect(x, y - 15, pointWidth * scale, margin); // horisontell
	ctx.fillStyle = "black";
	ctx.lineWidth = 1;
	drawPath(ctx,x,y - 15,[0, 0, pointWidth * scale, 0]);
	generateHorizontalCentimeters(ctx, x, y-5, pointWidth, 3, scale, margin)
}

export function drawInfoTextCTX( ctx : PImage.Context, text:string, angle:number, posx:number, posy:number){
		ctx.font = "4pt 'Liberation'";
		ctx.strokeStyle = 'black';
		ctx.rotate((angle * Math.PI) / 180.0);
		ctx.fillText(text, posx, posy);
		ctx.rotate((-angle * Math.PI) / 180.0);
	} 

export function drawStaveCurveCTX( ctx : PImage.Context, paperState : Paper, barrelDetails:BarrelDetails, config:StaveCurveConfigWithData, 
	maxStaveWidth = 100) {
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
	ctx.fillStyle = "black";
  ctx.font = "6pt 'Liberation'";
	ctx.imageSmoothingEnabled = true;
	ctx.lineWidth = 4;
	ctx.strokeStyle = 'black';

	drawCurve(curveXpos,outerBottomY,ctx,adjustedBottomOuterPoints, "Bottom, outer");
	drawCurve(curveXpos,innerBottomY,ctx,adjustedBottomInnerPoints, "Bottom, inner");
	drawCurve(curveXpos,outerTopY,ctx,adjustedTopOuterPoints,"Top, outer'");
	drawCurve(curveXpos,innerTopY,ctx,adjustedTopInnerPoints, "Top, inner");

	ctx.rect((rectX), (rectY), rectWidth, rectHeight);
	ctx.stroke();
	ctx.translate(-posX,-posY);
}


