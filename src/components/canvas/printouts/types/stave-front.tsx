import React from 'react';
import { Group, Line, Text } from 'react-konva';
import Cross from '../../commons/cross';
import { Barrel, BarrelDetails } from '@prisma/client';
import { ReactElement } from 'react';
import { BarrelWithData } from '@/db/queries/barrels';

function calcStaveTemplatePoints(topDiameter: number, bottomDiameter: number, staveLength: number) {
	const mmPerSizeChange = 15;
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
	scale: number;
	useCross?: boolean;
	barrelDetails: BarrelDetails;
	onClick: () => void;
};

function StaveFront({ x, y, scale, useCross = false, barrelDetails, onClick }: StaveProps) {
	const { bottomDiameter, topDiameter, staveLength } = { ...barrelDetails };
	const pointsData = calcStaveTemplatePoints(topDiameter, bottomDiameter, staveLength);

	let rotX = x;
	let rotY = y;

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
				//rotation={rotate ? 90 : 0}
				//x={rotate ? -element.y + 8 : element.x - 3}
				//y={rotate ? element.x - 4 : element.y - 6}'
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

	//if (!rotate) {
	rotY = y * 0.5 + staveLength * scale + 50;
	//} else {
	//	rotY = y * 0.5 + maxArea.height * 0.5 * scale;
	//	rotX = maxArea.width * scale - staveLength * scale;
	//}

	return (
		<Group>
			<Group scale={{ x: scale, y: scale }} x={rotX} y={rotY}>
				<Group draggable={true} onClick={onClick}>
					{lines}
					{textData}
				</Group>
				{useCross && <Cross color="blue" />}
			</Group>
		</Group>
	);
}

export default StaveFront;

