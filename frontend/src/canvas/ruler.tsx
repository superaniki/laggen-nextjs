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
	// Ensure we have at least 30 cm (300mm) to display, or more if needed
	const minMillimeters = 300; // Minimum 30cm
	const totalMillimeters = Math.max(minMillimeters, number * 10); // Convert to mm (1cm = 10mm)
	
	// Create array for all millimeter marks
	const elements = [];
	
	// Determine detail level based on scale
	// Higher scale = more zoomed in = show more detail
	// Lower scale = more zoomed out = show less detail
	const showMillimeters = scale > 30; // Only show mm marks when zoomed in enough
	const showHalfCentimeters = scale > 15; // Only show half-cm marks when moderately zoomed
	const showAllCmNumbers = scale > 20; // Only show all cm numbers when zoomed in enough
	const showHalfDecimeterNumbers = scale > 10; // Show numbers at 5cm intervals when moderately zoomed
	
	// Generate marks based on detail level
	for (let i = 0; i < totalMillimeters; i++) {
		const isDecimeter = i % 100 === 0; // Every 10cm (100mm)
		const isCentimeter = i % 10 === 0;
		const isHalfCentimeter = i % 5 === 0;
		
		// Skip rendering based on detail level, but ALWAYS show decimeters
		if (!isDecimeter && !isCentimeter && !showMillimeters && !isHalfCentimeter) continue;
		if (!isDecimeter && !isCentimeter && !showHalfCentimeters && isHalfCentimeter) continue;
		
		// Determine line length - longer for decimeter, medium for cm, shorter for half-cm, shortest for mm
		let markLength = length;
		if (isDecimeter) {
			markLength += 10; // Extra long mark for decimeter (10cm)
		} else if (isCentimeter) {
			markLength += 6; // Longer mark for cm
		} else if (isHalfCentimeter) {
			markLength += 3; // Medium mark for half-cm
		}
		
		// Calculate position - convert mm to screen units
		const position = (i / 10) * scale;
		
		elements.push(
			<Group key={'h-' + i}>
				<Line
					strokeWidth={isDecimeter ? 1 : (isCentimeter ? 0.7 : 0.5)}
					x={x}
					y={y}
					fill={'white'}
					points={[position, -margin, position, -margin + markLength]}
					stroke={'black'}
				/>
				{/* Show numbers based on zoom level */}
				{isCentimeter && (
					// Show all cm numbers when zoomed in enough
					// Show only 5cm interval numbers (0, 5, 10, 15, etc.) when moderately zoomed
					// Always show decimeter numbers (0, 10, 20, etc.)
					(showAllCmNumbers || 
					 (showHalfDecimeterNumbers && (i % 50 === 0 || isDecimeter)) || 
					 (!showHalfDecimeterNumbers && isDecimeter)) && (
						<Text
							key={'text' + i}
							x={x + 2 + position}
							y={y - 15} // Lower position to accommodate larger font
							fontSize={isDecimeter ? 12 : 10} // Slightly larger for decimeters
							fontStyle={isDecimeter ? 'bold' : 'normal'} // Bold for decimeters
							text={String(i / 10)} // Show cm value
							align="left"
							width={700}
						/>
					)
				)}
			</Group>
		);
	}
	
	return elements;
}

function generateVerticalCentimeters(x: number, y: number, number: number, length: number, scale: number, margin: number) {
	// Calculate how many millimeters we need to represent
	// Ensure we have at least 30 cm (300mm) to display, or more if needed
	const minMillimeters = 300; // Minimum 30cm
	const totalMillimeters = Math.max(minMillimeters, number * 10); // Convert to mm (1cm = 10mm)
	
	// Create array for all millimeter marks
	const elements = [];
	
	// Determine detail level based on scale
	// Higher scale = more zoomed in = show more detail
	// Lower scale = more zoomed out = show less detail
	const showMillimeters = scale > 30; // Only show mm marks when zoomed in enough
	const showHalfCentimeters = scale > 15; // Only show half-cm marks when moderately zoomed
	const showAllCmNumbers = scale > 20; // Only show all cm numbers when zoomed in enough
	const showHalfDecimeterNumbers = scale > 10; // Show numbers at 5cm intervals when moderately zoomed
	
	// Generate marks based on detail level
	for (let i = 0; i < totalMillimeters; i++) {
		const isDecimeter = i % 100 === 0; // Every 10cm (100mm)
		const isCentimeter = i % 10 === 0;
		const isHalfCentimeter = i % 5 === 0;
		
		// Skip rendering based on detail level, but ALWAYS show decimeters
		if (!isDecimeter && !isCentimeter && !showMillimeters && !isHalfCentimeter) continue;
		if (!isDecimeter && !isCentimeter && !showHalfCentimeters && isHalfCentimeter) continue;
		
		// Determine line length - longer for decimeter, medium for cm, shorter for half-cm, shortest for mm
		let markLength = length;
		if (isDecimeter) {
			markLength += 8; // Extra long mark for decimeter (10cm)
		} else if (isCentimeter) {
			markLength += 4; // Longer mark for cm
		} else if (isHalfCentimeter) {
			markLength += 2; // Medium mark for half-cm
		}
		
		// Calculate position - convert mm to screen units
		const position = (i / 10) * scale;
		
		elements.push(
			<Group key={'v-' + i}>
				<Line
					strokeWidth={isDecimeter ? 1 : (isCentimeter ? 0.7 : 0.5)}
					x={x}
					y={y}
					fill={'white'}
					points={[margin - markLength, -position, margin, -position]}
					stroke={'black'}
				/>
				{/* Show numbers based on zoom level */}
				{isCentimeter && (
					// Show all cm numbers when zoomed in enough
					// Show only 5cm interval numbers (0, 5, 10, 15, etc.) when moderately zoomed
					// Always show decimeter numbers (0, 10, 20, etc.)
					(showAllCmNumbers || 
					 (showHalfDecimeterNumbers && (i % 50 === 0 || isDecimeter)) || 
					 (!showHalfDecimeterNumbers && isDecimeter)) && (
						<Text
							key={'text' + i}
							x={x + margin - 20} // Adjusted for larger font
							y={y - position - 15} // Lower position to accommodate larger font
							fontSize={isDecimeter ? 12 : 10} // Slightly larger for decimeters
							fontStyle={isDecimeter ? 'bold' : 'normal'} // Bold for decimeters
							text={String(i / 10)} // Show cm value
							align="left"
							width={700}
						/>
					)
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
	width = 100, // This will be overridden to be 1/3 of screen width
	height = 100,
	margin = 10,
	xLength = 'max',
	yLength = 'max',
}: RulerProps) {

	// Make ruler width exactly 1/3 of the screen width
	const rulerWidth = width / 3;
	
	// Calculate exactly how many centimeters will fit in the ruler width
	// First convert ruler width from pixels to ruler units
	const rulerWidthInUnits = rulerWidth / scale;
	
	// Calculate how many full centimeters will fit
	const fullCentimeters = Math.floor(rulerWidthInUnits);
	
	// Add a small buffer to ensure we don't cut off any markings
	const pointsNeeded = fullCentimeters + 1;
	
	// Calculate points based on the needed width
	const pointWidth = Number(xLength == 'max' ? pointsNeeded : xLength);
	const pointHeight = Number(yLength == 'max' ? -height + margin : yLength);

	return (
		<Group>
			{/* Background rectangles for ruler */}
			<Rect x={x + margin} y={y - margin} width={rulerWidth} height={margin} fill={'white'} />
			<Rect x={x} y={y - margin} width={margin} height={pointHeight * scale} fill={'white'} />

			{/* Create a clipping container for the ruler markings */}
			<Group
				clipX={x + margin}
				clipY={y - margin}
				clipWidth={rulerWidth}
				clipHeight={margin}
			>
				{/* Generate enough centimeter marks to cover the ruler width */}
				{generateHorizontalCentimeters(x + margin, y, pointWidth, 3, scale, margin)}
			</Group>

			{/* Create a clipping container for the vertical ruler markings */}
			<Group
				clipX={x}
				clipY={y - margin}
				clipWidth={margin}
				clipHeight={pointHeight * scale}
			>
				{generateVerticalCentimeters(x, y - margin, -pointHeight, 10, scale, margin)}
			</Group>

			{/* Main ruler lines */}
			<Line
				key={'h-line'}
				strokeWidth={0.5}
				x={x + margin}
				y={y - margin}
				fill={'white'}
				points={[0, 0, rulerWidth, 0]}
				stroke={'black'}
			/>
			<Line
				key={'v-line'}
				strokeWidth={0.5}
				x={x + margin}
				y={y - margin}
				fill={'white'}
				points={[0, 0, 0, pointHeight * scale]}
				stroke={'black'}
			/>
		</Group>
	);
}