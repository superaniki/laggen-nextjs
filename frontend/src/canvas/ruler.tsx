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

function generateHorizontalCentimeters(x: number, y: number, number: number, length: number, scale: number, margin: number) {
	// Calculate how many millimeters we need to represent
	const totalMillimeters = number * 10; // Convert to mm (1cm = 10mm)
	
	// Create array for all millimeter marks
	const elements = [];
	
	// Generate millimeter marks (thin lines)
	for (let i = 0; i < totalMillimeters; i++) {
		// Only show cm marks (every 10mm)
		const isCentimeter = i % 10 === 0;
		const isHalfCentimeter = i % 5 === 0;
		
		// Determine line length - longer for cm, medium for half-cm, short for mm
		let markLength = length;
		if (isCentimeter) {
			markLength += 6; // Longer mark for cm
		} else if (isHalfCentimeter) {
			markLength += 3; // Medium mark for half-cm
		}
		
		// Calculate position - convert mm to screen units
		const position = (i / 10) * scale;
		
		elements.push(
			<Group key={'h-' + i}>
				<Line
					strokeWidth={isCentimeter ? 0.7 : 0.5}
					x={x}
					y={y}
					fill={'white'}
					points={[position, -margin, position, -margin + markLength]}
					stroke={'black'}
				/>
				{isCentimeter && (
					<Text
						key={'text' + i}
						x={x + 2 + position}
						y={y - 10}
						fontSize={5}
						text={String(i / 10)} // Convert mm index to cm
						align="left"
						width={700}
					/>
				)}
			</Group>
		);
	}
	
	return elements;
}

function generateVerticalCentimeters(x: number, y: number, number: number, length: number, scale: number, margin: number) {
	// Calculate how many millimeters we need to represent
	const totalMillimeters = number * 10; // Convert to mm (1cm = 10mm)
	
	// Create array for all millimeter marks
	const elements = [];
	
	// Generate millimeter marks (thin lines)
	for (let i = 0; i < totalMillimeters; i++) {
		// Only show cm marks (every 10mm)
		const isCentimeter = i % 10 === 0;
		const isHalfCentimeter = i % 5 === 0;
		
		// Determine line length - longer for cm, medium for half-cm, short for mm
		let markLength = length;
		if (isCentimeter) {
			markLength += 4; // Longer mark for cm
		} else if (isHalfCentimeter) {
			markLength += 2; // Medium mark for half-cm
		}
		
		// Calculate position - convert mm to screen units
		const position = (i / 10) * scale;
		
		elements.push(
			<Group key={'v-' + i}>
				<Line
					strokeWidth={isCentimeter ? 0.7 : 0.5}
					x={x}
					y={y}
					fill={'white'}
					points={[margin - markLength, -position, margin, -position]}
					stroke={'black'}
				/>
				{isCentimeter && (
					<Text
						key={'text' + i}
						x={x + margin - 15}
						y={y - position - 10}
						fontSize={5}
						text={String(i / 10)} // Convert mm index to cm
						align="left"
						width={700}
					/>
				)}
			</Group>
		);
	}
	
	return elements;
}

export default function Ruler({
	scale = 10,
	x = 0,
	y = 0,
	width = 100,
	height = 100,
	margin = 10,
	xLength = 'max',
	yLength = 'max',
}: RulerProps) {


	const pointWidth = Number(xLength == 'max' ? width - margin : xLength);
	const pointHeight = Number(yLength == 'max' ? -height + margin : yLength);

	return (
		<Group>
			<Rect x={x + margin} y={y - margin} width={pointWidth * scale} height={margin} fill={'white'} />
			<Rect x={x} y={y - margin} width={margin} height={pointHeight * scale} fill={'white'} />

			<Line
				key={'h-line'}
				strokeWidth={0.5}
				x={x + margin}
				y={y - margin}
				fill={'white'}
				points={[0, 0, pointWidth * scale, 0]}
				stroke={'black'}
			></Line>
			<Line
				key={'v-line'}
				strokeWidth={0.5}
				x={x + margin}
				y={y - margin}
				fill={'white'}
				points={[0, 0, 0, pointHeight * scale]}
				stroke={'black'}
			></Line>
			{generateHorizontalCentimeters(x + margin, y, pointWidth, 3, scale, margin)}
			{generateVerticalCentimeters(x, y - margin, -pointHeight, 10, scale, margin)}
		</Group>
	);
}