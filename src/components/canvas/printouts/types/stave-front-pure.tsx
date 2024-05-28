import { Group, Line, Text } from 'react-konva';
import { BarrelDetails } from '@prisma/client';
import { ReactElement } from 'react';
import { StaveFrontConfigWithData } from '@/db/queries/barrels';
import { Paper } from '@/common/enums';

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
	scale: number;
	barrelDetails: BarrelDetails;
	config: StaveFrontConfigWithData;
	paperState: Paper
};

function StaveFrontPure({ x, scale, barrelDetails, config, paperState }: StaveProps) {
	const { bottomDiameter, topDiameter, staveLength } = { ...barrelDetails };

	const configDetailsArray = config.configDetails;
	const configDetails = configDetailsArray.find(item => (item.paperType === paperState));

	if (configDetails === undefined)
		return <></>;
	const { posY, spacing } = { ...configDetails }
	const pointsData = calcStaveTemplatePoints(topDiameter, bottomDiameter, staveLength, spacing);

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

	return (
		<Group x={x} y={posY} scale={{ x: scale, y: scale }} draggable={true}>
			{lines}
			{textData}
		</Group >
	);
}

export default StaveFrontPure;

