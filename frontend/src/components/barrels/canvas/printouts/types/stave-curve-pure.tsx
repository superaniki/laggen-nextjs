import { Group, Rect, Line, Text } from 'react-konva';
import { findAdjustedDiameter, createCurveMaxWidth } from '../../commons/barrel-math';
import { BarrelDetails } from '@prisma/client';
import { StaveCurveConfigWithData } from '@/db/queries/barrels';
import { Paper } from '@/common/enums';


type ToolCurveProps = {
	id: string;
	x: number;
	y: number;
	points: number[];
	title: string;
	closed?: boolean;
};

function Curve({ id, x, y, points, title, closed = false }: ToolCurveProps) {
	return (
		<Group id={id} x={x} y={y} draggable>§
			<Line closed={closed} points={points} stroke={'black'} strokeWidth={1} />
			<Text x={4.5} y={-10} text={title} fontSize={8} fill={'black'} />
		</Group>
	);
}

type StaveCurvePureProps = {
	barrelDetails: BarrelDetails
	config: StaveCurveConfigWithData;
	scale: number;
	maxStaveWidth?: number;
	paperState: Paper
};

export enum StaveCurves {
	InnerTop,
	OuterTop,
	InnerBottom,
	OuterBottom
}

function StaveCurvePure({ paperState, barrelDetails, config, scale, maxStaveWidth = 100 }: StaveCurvePureProps) {
	const { height, angle, bottomDiameter, staveBottomThickness, staveTopThickness } = { ...barrelDetails };

	const configDetailsArray = config.configDetails;

	const configDetails = configDetailsArray.find(item => (item.paperType === paperState));
	if (configDetails === undefined)
		return <></>;

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

	return (
		<Group x={posX} y={posY} draggable scale={{ x: scale, y: scale }}>
			<Curve id={"innerTopY"} x={curveXpos} y={innerTopY} points={adjustedTopInnerPoints} title={'Top, inner!'} />
			<Curve id={"outerTopY"} x={curveXpos} y={outerTopY} points={adjustedTopOuterPoints} title={'Top, outer'} />
			<Curve id={"innerBottomY"} x={curveXpos} y={innerBottomY} points={adjustedBottomInnerPoints} title={'Bottom, inner'} />
			<Curve id={"outerBottomY"} x={curveXpos} y={outerBottomY} points={adjustedBottomOuterPoints} title={'Bottom, outer'} />
			<Rect id="rect" stroke={'black'} strokeWidth={1} fill="white" x={rectX} y={rectY} width={rectWidth} height={rectHeight} />
		</Group>
	);
}


export default StaveCurvePure;