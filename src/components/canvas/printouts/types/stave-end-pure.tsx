import { Group, Line, Text } from 'react-konva';
import { findAdjustedDiameter, createCurveForStaveEnds } from '../../commons/barrel-math';
import { StaveEndConfigWithData } from '@/db/queries/barrels';
import { Paper } from '@/common/enums';

type ToolCurveProps = {
	id: string
	x?: number;
	y: number;
	points: number[];
	title: string;
	closed: boolean;
};

function ToolCurve({ id, x = 0, y, points, title, closed }: ToolCurveProps) {
	const linePoints = [];
	for (let i = 0; i < points.length; i += 8) {
		linePoints.push({ x: Number(points[i]), y: Number(points[i + 1]) });
	}

	return (
		<Group x={x} y={y} draggable>
			<Line closed={closed} points={points} stroke={'black'} strokeWidth={1} />
			<Text x={4.5} y={-10} text={title} fontSize={8} fill={'black'} />
		</Group>
	);
}

function reversePairs(arr: number[]) {
	return arr.map((_, i) => arr[arr.length - i - 2 * (1 - (i % 2))]);
}

type StaveEndsPureProps = {
	x: number;
	y: number;
	angle: number;
	height: number;
	bottomDiameter: number;
	staveBottomThickness: number;
	staveTopThickness: number;
	scale: number;
	useCross?: boolean;
	config: StaveEndConfigWithData;
	paperState: Paper
};

function StaveEndsPure({ paperState, x, y, angle, height, bottomDiameter, staveBottomThickness, staveTopThickness,
	scale, config }: StaveEndsPureProps) {

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
		</Group>
	);
}

export default StaveEndsPure;
