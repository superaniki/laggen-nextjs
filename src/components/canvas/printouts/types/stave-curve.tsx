import React, { useState } from 'react';
import { Group, Rect, Line, Text, Transformer } from 'react-konva';
import Cross from '../../commons/cross';
import { findAdjustedDiameter, createCurveMaxWidth } from '../../commons/barrel-math';
import { Barrel, BarrelDetails, StaveCurveConfig } from '@prisma/client';
import { Paper } from '../on-paper';
import { BarrelWithData, StaveCurveConfigWithData } from '@/db/queries/barrels';

type ToolCurveProps = {
	id: string;
	x: number;
	y: number;
	points: number[];
	title: string;
	closed?: boolean;
};

/* [currentSelection, setCurrentSelection, clearSelection] = useSelection(); */

function Curve({ id, x, y, points, title, closed = false }: ToolCurveProps) {
	const [isHovered, setIsHovered] = useState(false);
	const [isSelected, setIsSelected] = useState(false);
	const selMargin = 5;

	const rect = {
		x1: points[0] - selMargin,
		y1: points[1] - selMargin,
		x2: points[points.length - 2] + selMargin * 2,
		y2: points[points.length - 1] + selMargin * 2
	}
	console.log("isSelected: " + isSelected);

	function handleOnClick() {
		isHovered ? setIsSelected(true) : setIsSelected(false);
	}

	return (
		<Group id={id} onClick={() => handleOnClick()} onMouseLeave={() => setIsHovered(false)} onMouseOver={() => setIsHovered(true)} x={x} y={y} draggable>
			<Rect stroke={"#FFAAAA"} strokeWidth={2} cornerRadius={5} strokeEnabled={isHovered} x={rect.x1} y={rect.y1} width={rect.x2} height={rect.y2} />
			<Rect stroke={"#DD4444"} strokeWidth={2} cornerRadius={5} strokeEnabled={isSelected} x={rect.x1} y={rect.y1} width={rect.x2} height={rect.y2} />
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
	//onUpdate: (updatedConfig: ToolConfig) => void
};


export enum StaveCurves {
	InnerTop,
	OuterTop,
	InnerBottom,
	OuterBottom
}

function StaveCurve({ barrelDetails, config, scale, cross = false, maxStaveWidth = 100 }: StaveCurveProps) {
	const { height, angle, bottomDiameter, staveBottomThickness, staveTopThickness } = { ...barrelDetails };
	//let localConfig = config;
	const defaultPaperType = config.defaultPaperType;
	//const paperType = defaultPaperType === ("A4" || "A3") ? defaultPaperType : "A4";
	const configDetailsArray = config.configDetails;

	const configDetails = configDetailsArray.find(item => (item.paperType === defaultPaperType));
	if (configDetails === undefined)
		return <></>;

	const { posX, posY, innerTopX, innerTopY, outerTopX, outerTopY, innerBottomX, innerBottomY,
		outerBottomX, outerBottomY, rectX, rectY, rectWidth, rectHeight } = { ...configDetails }


	/*
onUpdate ramlar in! Nu skall den uppdateras med ny data när jag pillar på nåt.
	*/

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
		<Group onClick={() => console.log("Hej")} x={posX} y={posY} scale={{ x: scale, y: scale }}>
			<Curve id={"InnerTop"} x={innerTopX} y={innerTopY} points={adjustedTopInnerPoints} title={'Top, inner!'} />
			<Curve id={"OuterTop"} x={outerTopX} y={outerTopY} points={adjustedTopOuterPoints} title={'Top, outer'} />
			<Curve id={"InnerBottom"} x={innerBottomX} y={innerBottomY} points={adjustedBottomInnerPoints} title={'Bottom, inner'} />
			<Curve id={"OuterBottom"} x={outerBottomX} y={outerBottomY} points={adjustedBottomOuterPoints} title={'Bottom, outer'} />
			<Rect id="rect" draggable stroke={'black'} strokeWidth={1} fill="white" x={rectX} y={rectY} width={rectWidth} height={rectHeight} />
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