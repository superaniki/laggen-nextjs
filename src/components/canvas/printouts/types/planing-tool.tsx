import React, { useState } from 'react';
import { Group, Rect, Line, Text, Transformer } from 'react-konva';
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
	const [selected, setSelected] = useState(false);
	const selMargin = 5;

	const rect = {
		x1: points[0] - selMargin,
		y1: points[1] - selMargin,
		x2: points[points.length - 2] + selMargin * 2,
		y2: points[points.length - 1] + selMargin * 2
	}

	return (
		<Group onMouseLeave={() => setSelected(false)} onMouseOver={() => setSelected(true)} x={x} y={y} draggable>
			<Rect stroke={"#FFAAAA"} strokeWidth={2} cornerRadius={5} strokeEnabled={selected} x={rect.x1} y={rect.y1} width={rect.x2} height={rect.y2} />

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

	const trRef = React.useRef(null);
	const shapeRef = React.useRef();


	return (
		<Group x={x} y={y} scale={{ x: scale, y: scale }}>
			<ToolCurve x={20.5} y={-220} points={adjustedTopInnerPoints} title={'Top, inner'} />
			<ToolCurve x={20.5} y={-180} points={adjustedTopOuterPoints} title={'Top, outer'} />
			<ToolCurve x={20.5} y={-90} points={adjustedBottomInnerPoints} title={'Bottom, inner'} />
			<ToolCurve x={20.5} y={-50} points={adjustedBottomOuterPoints} title={'Bottom, outer'} />
			<Rect stroke={'black'} strokeWidth={1} fill="white" x={0} y={0} width={20} height={-250} />
			<Cross visible={cross} color="green" />


			<Transformer
				ref={trRef}
				flipEnabled={false}
				boundBoxFunc={(oldBox, newBox) => {
					// limit resize
					if (Math.abs(newBox.width) < 5 || Math.abs(newBox.height) < 5) {
						return oldBox;
					}
					return newBox;
				}}
			/>
		</Group>
	);
}

export default PlaningTool;
