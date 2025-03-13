import React, { useRef } from 'react';
import { Group, Line, Text } from 'react-konva';
import { BarrelDetails } from '@prisma/client';
import { ReactElement } from 'react';
import { StaveFrontConfigWithData } from '@/db/queries/barrels';
import usePaperSize from '@/hooks/usePaperSize';
import { KonvaEventObject } from 'konva/lib/Node';
import useBarrelStore from '@/store/barrel-store';
import { StaveTool } from '@/common/enums';
import { round } from '@/common/barrel-math';
import { SelectionRect } from './selection-rect';

function calcStaveTemplatePoints(topDiameter: number, bottomDiameter: number, staveLength: number, spacing: number) {
	const mmPerSizeChange = spacing;
	const mmPerSizeChangeBottom = (bottomDiameter / topDiameter) * mmPerSizeChange;
	const points = [];
	const textData = [];

	let diaBottom = bottomDiameter;
	let count = 1;

	for (let diaTop = topDiameter; diaTop >= 0 && diaBottom >= 0; diaTop -= mmPerSizeChange) {
		points.push([-diaBottom * 0.5, 0, -diaTop * 0.5, -staveLength, diaTop * 0.5, -staveLength, diaBottom * 0.5, 0]);
		textData.push({ x: -diaTop * 0.5, y: -staveLength, text: String(count) });
		textData.push({ x: diaTop * 0.5, y: -staveLength, text: String(count) });
		count++;
		diaBottom -= mmPerSizeChangeBottom;
	}
	return { points: points, textData: textData };
}

type StaveProps = {
	x: number;
	y: number;
	barrelDetails: BarrelDetails;
	config: StaveFrontConfigWithData;
};

function StaveFront({ x, barrelDetails, config }: StaveProps) {
	const { bottomDiameter, topDiameter, staveLength } = { ...barrelDetails };
	const { updateToolDetails } = useBarrelStore();
	const curveRef = useRef<any>();

	const paperState = usePaperSize();
	const configDetailsArray = config.configDetails;
	const configDetails = configDetailsArray.find(item => (item.paperType === paperState));

	if (configDetails === undefined)
		return <></>;
	const { posY, spacing } = { ...configDetails }
	const pointsData = calcStaveTemplatePoints(topDiameter, bottomDiameter, staveLength, spacing);
	const selMargin = 5;

	const lines: ReactElement[] = [];
	let id = 0;
	pointsData.points.forEach((element) => {
		lines.push(
			<Line
				draggable={false}
				key={id++}
				points={element}
				stroke={'black'}
				strokeWidth={1}
				closed={true}
				fill={'lightgrey'}
			/>
		);
	});

	const textData: ReactElement[] = [];
	pointsData.textData.forEach((element) => {
		textData.push(
			<Text
				x={element.x - 3}
				y={element.y - 6}
				text={element.text}
				fontFamily="courier"
				fontSize={4}
				fill={'black'}
				key={id++}
			/>
		);
	});

	function handleOnDragMove(event: KonvaEventObject<DragEvent>) {
		curveRef.current.x(x); // lock X coordinate
		event.cancelBubble = true;
		updateToolDetails(StaveTool.Front, "posX", round(event.target.x()));
		updateToolDetails(StaveTool.Front, "posY", round(event.target.y()));
	}

	const selPos = { x: (-topDiameter * 0.5) - selMargin, y: -staveLength - selMargin };
	const selSize = { x: (topDiameter * 0.5) * 2 + (selMargin * 2), y: staveLength + (selMargin * 2) }

	return (
		<Group x={x} y={posY} ref={curveRef} draggable={true} onDragMove={handleOnDragMove}>
			{lines}
			{textData}
			<SelectionRect pos={selPos} size={selSize} />
		</Group >
	);
}

export default StaveFront;

