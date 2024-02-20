import React, { MutableRefObject, useRef, useState } from 'react';
import { Group, Rect, Line, Text, Transformer } from 'react-konva';
import Cross from '../../commons/cross';
import { findAdjustedDiameter, createCurveMaxWidth, round } from '../../commons/barrel-math';
import { Barrel, BarrelDetails, StaveCurveConfig } from '@prisma/client';
import { Paper } from '../on-paper';
import { BarrelWithData, StaveCurveConfigWithData } from '@/db/queries/barrels';
import { KonvaEventObject } from 'konva/lib/Node';
import useBarrelStore from '@/components/barrels/store';

type ToolCurveProps = {
	id: string;
	x: number;
	y: number;
	points: number[];
	title: string;
	closed?: boolean;
};


function Curve({ id, x, y, points, title, closed = false }: ToolCurveProps) {
	const [isHovered, setIsHovered] = useState(false);
	const curveRef = useRef<any>();
	const { updateStaveCurve } = useBarrelStore();
	const selMargin = 5;

	const rect = {
		x1: points[0] - selMargin,
		y1: points[1] - selMargin,
		x2: points[points.length - 2] + selMargin * 2,
		y2: points[points.length - 1] + selMargin * 2
	}

	function handleOnDragMove(event: KonvaEventObject<DragEvent>) {
		curveRef.current.x(x); // lock X coordinate
		event.cancelBubble = true;
		updateStaveCurve(id, round(event.target.y(), 3));
	}

	return (
		<Group ref={curveRef} id={id} onMouseLeave={() => setIsHovered(false)} onDragMove={handleOnDragMove} onMouseOver={() => setIsHovered(true)} x={x} y={y} draggable>
			<Rect stroke={"#FFAAAA"} strokeWidth={2} cornerRadius={5} strokeEnabled={isHovered} x={rect.x1} y={rect.y1} width={rect.x2} height={rect.y2} />
			{/*	<Rect stroke={"#DD4444"} strokeWidth={2} cornerRadius={5} strokeEnabled={isSelected} x={rect.x1} y={rect.y1} width={rect.x2} height={rect.y2} />*/}
			<Line closed={closed} points={points} stroke={'black'} strokeWidth={1} />
			<Text x={4.5} y={-10} text={title} fontSize={8} fill={'black'} />
		</Group>
	);
}

type StaveCurveProps = {
	barrelDetails: BarrelDetails
	config: StaveCurveConfigWithData;
	scale: number;
	cross?: boolean;
	maxStaveWidth?: number;
};


export enum StaveCurves {
	InnerTop,
	OuterTop,
	InnerBottom,
	OuterBottom
}

function StaveCurve({ barrelDetails, config, scale, cross = false, maxStaveWidth = 100 }: StaveCurveProps) {
	const { height, angle, bottomDiameter, staveBottomThickness, staveTopThickness } = { ...barrelDetails };
	const { updateStaveCurve } = useBarrelStore();

	const defaultPaperType = config.defaultPaperType;
	const configDetailsArray = config.configDetails;

	const configDetails = configDetailsArray.find(item => (item.paperType === defaultPaperType));
	if (configDetails === undefined)
		return <></>;

	const { posX, posY, innerTopX, innerTopY, outerTopX, outerTopY, innerBottomX, innerBottomY,
		outerBottomX, outerBottomY, rectX, rectY, rectWidth, rectHeight } = { ...configDetails }

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

	function handleOnDragMove(event: KonvaEventObject<DragEvent>) {
		updateStaveCurve("posX", round(event.target.x(), 2));
		updateStaveCurve("posY", round(event.target.y(), 2));
	}

	return (
		<Group onDragMove={handleOnDragMove} x={posX} y={posY} draggable scale={{ x: scale, y: scale }}>
			<Curve id={"innerTopY"} x={curveXpos} y={innerTopY} points={adjustedTopInnerPoints} title={'Top, inner!'} />
			<Curve id={"outerTopY"} x={curveXpos} y={outerTopY} points={adjustedTopOuterPoints} title={'Top, outer'} />
			<Curve id={"innerBottomY"} x={curveXpos} y={innerBottomY} points={adjustedBottomInnerPoints} title={'Bottom, inner'} />
			<Curve id={"outerBottomY"} x={curveXpos} y={outerBottomY} points={adjustedBottomOuterPoints} title={'Bottom, outer'} />
			<Rect id="rect" stroke={'black'} strokeWidth={1} fill="white" x={rectX} y={rectY} width={rectWidth} height={rectHeight} />
			<Cross visible={cross} color="green" />
		</Group>
	);
}


export default StaveCurve;

/*
	<Group onClick={() => console.log("Hej")} y={y} scale={{ x: scale, y: scale }}>
			<Curve x={20.5} y={-220} points={adjustedTopInnerPoints} title={'Top, inner'} />
			<Curve x={20.5} y={-180} points={adjustedTopOuterPoints} title={'Top, outer'} />
			<Curve x={20.5} y={-90} points={adjustedBottomInnerPoints} title={'Bottom, inner'} />
			<Curve x={20.5} y={-50} points={adjustedBottomOuterPoints} title={'Bottom, outer'} />
			<Rect stroke={'black'} strokeWidth={1} fill="white" x={0} y={0} width={20} height={-250} />
			<Cross visible={cross} color="green" />
		</Group>

*/