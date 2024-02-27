import React, { useRef, useState } from 'react';
import Cross from '../../commons/cross';
import { Group, Line, Rect, Text } from 'react-konva';
import { findAdjustedDiameter, createCurveForStaveEnds, round } from '../../commons/barrel-math';
import usePaperSize from '@/components/hooks/usePaperSize';
import { StaveEndConfigWithData } from '@/db/queries/barrels';
import { KonvaEventObject } from 'konva/lib/Node';
import { StaveTool } from '@/store/edit-store';
import useBarrelStore from '@/store/barrel-store';
import { SelectionRect } from '../../commons/SelectionRect';

type ToolCurveProps = {
	id: string
	x?: number;
	y: number;
	points: number[];
	title: string;
	closed: boolean;
};

function ToolCurve({ id, x = 0, y, points, title, closed }: ToolCurveProps) {
	const curveRef = useRef<any>();
	const { updateToolDetails } = useBarrelStore();

	const linePoints = [];
	for (let i = 0; i < points.length; i += 8) {
		linePoints.push({ x: Number(points[i]), y: Number(points[i + 1]) });
	}

	function handleOnDragMove(event: KonvaEventObject<DragEvent>) {
		curveRef.current.x(x); // lock X coordinate
		event.cancelBubble = true;
		updateToolDetails(StaveTool.End, id, round(event.target.y()));
	}
	const selMargin = 5;

	const selPos = {
		x: linePoints[0].x - selMargin,
		y: linePoints[0].y + (selMargin)
	}
	const selSize = {
		x: -linePoints[0].x * 2 + (selMargin * 2),
		y: -linePoints[0].y - (selMargin * 2)
	}

	console.log(JSON.stringify(linePoints));

	return (
		<Group ref={curveRef} x={x} y={y} draggable onDragMove={handleOnDragMove}>
			<Line closed={closed} points={points} stroke={'black'} strokeWidth={1} />
			<Text x={4.5} y={-10} text={title} fontSize={8} fill={'black'} />
			<SelectionRect pos={selPos} size={selSize} />
		</Group>
	);
}

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
	config: StaveEndConfigWithData
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
	useCross = false,
	config
}: StaveEndsProps) {


	const paperState = usePaperSize();
	const configDetailsArray = config.configDetails;
	const configDetails = configDetailsArray.find(item => (item.paperType === paperState));
	if (configDetails === undefined)
		return <></>;

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
			<ToolCurve id={"topEndY"} y={configDetails.topEndY} points={topEndPoints} title={'Top Ends'} closed />
			<ToolCurve id={"bottomEndY"} y={configDetails.bottomEndY} points={bottomEndPoints} title={'Bottom Ends'} closed />
			<Cross visible={useCross} color="green" />
		</Group>
	);
}

export default StaveEnds;

/*

*/
