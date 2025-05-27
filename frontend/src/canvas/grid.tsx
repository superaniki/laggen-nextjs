import React from 'react';
import { Rect, Line, Group } from 'react-konva';
import Cross from './cross';

type GridProps = {
	pixelsPerCm: number;
	scale: number;
	x: number;
	y: number;
};

function Grid({ pixelsPerCm, scale, x, y }: GridProps) {
	const areaLength = Number(10000 * scale);
	const bgColor = '#EEE';
	const lineColor = '#C7C7C7';
	const spaceWidth = pixelsPerCm * scale;

	function horizontalLines(x: number, y: number, spaceWidth: number, areaLength: number) {
		const elements = Array.from(Array(10000))
			.filter((item, index) => index * spaceWidth < areaLength)
			.map((val, index) => {
				const lineY = index * spaceWidth;

				return (
					<Group key={'h-' + index}>
						<Line strokeWidth={1} x={x} y={y} points={[0, lineY, areaLength, lineY]} stroke={lineColor}></Line>
					</Group>
				);
			});
		return elements;
	}

	function verticalLines(x: number, y: number, spaceWidth: number, areaLength: number) {
		const elements = Array.from(Array(10000))
			.filter((item, index) => index * spaceWidth < areaLength)
			.map((val, index) => {
				const lineX = index * spaceWidth;

				return (
					<Group key={'v-' + index}>
						<Line strokeWidth={1} x={x} y={y} points={[lineX, 0, lineX, areaLength]} stroke={lineColor}></Line>
					</Group>
				);
			});
		return elements;
	}
	return (
		<Group>
			{/* <Rect
				x={-areaLength * 0.5}
				y={-areaLength * 0.5}
				width={areaLength}
				height={areaLength}
				fill={bgColor}
			//scale=Vector2D {pixelsPerCm * scale}
			></Rect> */}
			{horizontalLines(-areaLength * 0.5, -areaLength * 0.5, pixelsPerCm * scale, areaLength)}
			{verticalLines(-areaLength * 0.5, -areaLength * 0.5, pixelsPerCm * scale, areaLength)}
			<Cross x={10} y={10} color="blue" />
		</Group>
	);
}

export default Grid;
