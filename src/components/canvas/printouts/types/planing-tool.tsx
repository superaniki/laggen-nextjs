import React from 'react';
import { Group, Rect, Line, Text } from 'react-konva';
import Cross from '../../commons/cross';
import { findAdjustedDiameter, createCurveMaxWidth } from '../../commons/barrel-math';
import { Barrel } from '@prisma/client';

type ToolCurveProps = {
	x: number;
	y: number;
	points: number[];
	title: string;
	closed?: boolean;
};
function ToolCurve({ x, y, points, title, closed = false }: ToolCurveProps) {
	return (
		<Group x={x} y={y} draggable>
			<Line closed={closed} points={points} stroke={'black'} strokeWidth={1} />
			<Text x={4.5} y={-10} text={title} fontSize={8} fill={'black'} />
		</Group>
	);
}

type PlaningToolProps = {
	x: number;
	y: number;
	barrel: Barrel;
	scale: number;
	cross?: boolean;
	maxStaveWidth?: number;
};

function PlaningTool({ x, y, barrel, scale, cross = false, maxStaveWidth = 100 }: PlaningToolProps) {
	const { height, angle, bottomDiameter, staveBottomThickness, staveTopThickness } = { ...barrel };

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

	return (
		<Group x={x} y={y} scale={{ x: scale, y: scale }}>
			<ToolCurve x={20.5} y={-220} points={adjustedTopInnerPoints} title={'Top, inner'} />
			<ToolCurve x={20.5} y={-180} points={adjustedTopOuterPoints} title={'Top, outer'} />
			<ToolCurve x={20.5} y={-90} points={adjustedBottomInnerPoints} title={'Bottom, inner'} />
			<ToolCurve x={20.5} y={-50} points={adjustedBottomOuterPoints} title={'Bottom, outer'} />
			<Rect stroke={'black'} strokeWidth={1} fill="white" x={0} y={0} width={20} height={-250} />
			<Cross visible={cross} color="green" />
		</Group>
	);
}

export default PlaningTool;
