import React from 'react';
import { Group, Line, Rect, Text } from 'react-konva';

type RulerProps = {
	scale?: number;
	x?: number;
	y?: number;
	width?: number;
	height?: number;
	margin?: number;
	xLength?: number | string;
	yLength?: number | string;
};

function Ruler({
	scale = 10,
	x = 0,
	y = 0,
	width = 100,
	height = 100,
	margin = 10,
	xLength = 'max',
	yLength = 'max',
}: RulerProps) {
	function generateHorizontalCentimeters(x: number, y: number, number: number, length: number, scale: number) {
		const elements = Array.from(Array(number)).map((val, index) => {
			const extraLength = Number.isInteger(index / 5) ? 6 : 0;
			return (
				<Group key={'h-' + index}>
					<Line
						strokeWidth={1}
						x={x}
						y={y}
						fill={'white'}
						points={[index * scale, -margin, index * scale, -margin + length + extraLength]}
						stroke={'black'}
					></Line>
					{extraLength ? (
						<Text
							key={'text' + index}
							x={x + 2 + index * scale}
							y={y - 10}
							fontSize={10}
							text={String(index)}
							align="left"
							width={700}
						/>
					) : (
						<></>
					)}
				</Group>
			);
		});
		return elements;
	}
	function generateVerticalCentimeters(x: number, y: number, number: number, length: number, scale: number) {
		const elements = Array.from(Array(number)).map((val, index) => {
			const extraLength = Number.isInteger(index / 5) ? 4 : 0;

			return (
				<Group key={'v-' + index}>
					<Line
						strokeWidth={1}
						x={x}
						y={y}
						fill={'white'}
						points={[margin - length - extraLength, -index * scale, margin, -index * scale]}
						stroke={'black'}
					></Line>
					{extraLength ? (
						<Text
							key={'text' + index}
							x={x + margin - 15}
							y={y - index * scale - 10}
							fontSize={10}
							text={String(index)}
							align="left"
							width={700}
						/>
					) : (
						<></>
					)}
				</Group>
			);
		});
		return elements;
	}

	const pointWidth = Number(xLength == 'max' ? width - margin : xLength);
	const pointHeight = Number(yLength == 'max' ? -height + margin : yLength);

	return (
		<Group>
			<Rect x={x + margin} y={y - margin} width={pointWidth * scale} height={margin} fill={'white'} />
			<Rect x={x} y={y - margin} width={margin} height={pointHeight * scale} fill={'white'} />

			<Line
				key={'h-line'}
				strokeWidth={1}
				x={x + margin}
				y={y - margin}
				fill={'white'}
				points={[0, 0, pointWidth * scale, 0]}
				stroke={'black'}
			></Line>
			<Line
				key={'v-line'}
				strokeWidth={1}
				x={x + margin}
				y={y - margin}
				fill={'white'}
				points={[0, 0, 0, pointHeight * scale]}
				stroke={'black'}
			></Line>
			{generateHorizontalCentimeters(x + margin, y, pointWidth, 10, scale)}
			{generateVerticalCentimeters(x, y - margin, -pointHeight, 10, scale)}
		</Group>
	);
	// x = x + margin
}

export default Ruler;
