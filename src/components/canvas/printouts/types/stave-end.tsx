import React from 'react';
import Cross from '../../commons/cross';
import { Group, Line, Text } from 'react-konva';
import { findAdjustedDiameter, createCurveForStaveEnds } from '../../commons/barrel-math';

type ToolCurveProps = {
	x?: number;
	y: number;
	points: number[];
	title: string;
	closed: boolean;
};
function ToolCurve({ x = 0, y, points, title, closed }: ToolCurveProps) {
	const linePoints = [];
	for (let i = 0; i < points.length; i += 8) {
		linePoints.push({ x: Number(points[i]), y: Number(points[i + 1]) });
	}
	//const radius = points[Math.floor(points.length)];

	/*
				function Lines(points) {
						return points.map((value, index, array) => {
								if (index > points.length * 0.5)
										return null;
								return <Group>
										<Line points={[array[array.length - 2].x - array[0].x, array[0].y, value.x, value.y]}
												stroke={"black"} strokeWidth={0.5} />
								</Group>
						});
				}
				*/

	return (
		<Group x={x} y={y} draggable>
			<Line closed={closed} points={points} stroke={'black'} strokeWidth={1} />
			<Text x={4.5} y={-10} text={title} fontSize={8} fill={'black'} />
		</Group>
	);
}

/*        <Line points={[0, 999, 0, -999]} stroke={"black"} strokeWidth={0.5} />
		{Lines(linePoints)}
		<Circle x={linePoints[linePoints.length - 2].x - linePoints[0].x} y={linePoints[0].y} radius={radius} fill={"white"} />
*/

function reversePairs(arr: number[]) {
	return arr.map((_, i) => arr[arr.length - i - 2 * (1 - (i % 2))]);
}

type StaveEndsProps = {
	x: number;
	y: number;
	angle: number;
	height: number;
	bottomDiameter: number;
	staveBottomThickness: number;
	staveTopThickness: number;
	scale: number;
	useCross?: boolean;
};

function StaveEnds({
	x,
	y,
	angle,
	height,
	bottomDiameter,
	staveBottomThickness,
	staveTopThickness,
	scale,
	useCross = true,
}: StaveEndsProps) {
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

	return (
		<Group x={x} y={y} scale={{ x: scale, y: scale }}>
			<ToolCurve y={scale} points={topEndPoints} title={'Top Ends'} closed />
			<ToolCurve y={20 * scale} points={bottomEndPoints} title={'Bottom Ends'} closed />
			<Cross visible={useCross} color="green" />
		</Group>
	);
}

export default StaveEnds;

/*

*/
