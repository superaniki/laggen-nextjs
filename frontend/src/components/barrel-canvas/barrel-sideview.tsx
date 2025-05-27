import React from 'react';
import { Line, Group, Rect } from 'react-konva';
import { Image } from 'react-konva';
import { BarrelDetails } from '@prisma/client';
import { findScaleToFit } from '@/common/barrel-math';
import { Cross, Grid, Ruler } from '@/canvas';
import { useImageCache } from '@/hooks/useImageCache';

type BarrelSideviewProps = {
	worldX: number;
	worldY: number;
	dimensions: { width: number; height: number };
	barrel: BarrelDetails;
	useGrid?: boolean;
	useRuler?: boolean;
	useCross?: boolean;
	thickStroke?: boolean;
	previewStyle?: boolean;
};

function BarrelSideview({
	worldX,
	worldY,
	dimensions,
	barrel,
	useGrid = false,
	useRuler = false,
	useCross = false,
	thickStroke = false,
}: BarrelSideviewProps) {
	const pixelsPerCm = 40;
	const pixelsPerMm = pixelsPerCm * 0.1;
	const barrelColor = '#F4D279';

	const {
		angle,
		height,
		bottomDiameter,
		topDiameter,
		staveTopThickness,
		staveBottomThickness,
		bottomThickness,
		bottomMargin,
		staveLength,
	} = { ...barrel };

	const width = bottomDiameter > topDiameter ? bottomDiameter : topDiameter;
	let scale = findScaleToFit(dimensions, { width: width, height: height }, 0.8); // 20% margin
	scale = Math.min(3, scale);
	const url = '/apple.png';
	// Use the global image cache hook
	const [image, imageStatus] = useImageCache(url);

	const stroke = thickStroke ? 4 : 1;

	const tan = Math.tan((angle * Math.PI) / 180);
	const length = tan * height; // position till motsatt sida av vinkeln
	const outlinePoints = [0, 0, -length, -height, bottomDiameter + length, -height, bottomDiameter, 0];
	const leftStavePoints = [0, 0, 0, -staveLength, staveTopThickness, -staveLength, staveBottomThickness, 0];
	const rightStavePoints = [0, 0, 0, -staveLength, -staveTopThickness, -staveLength, -staveBottomThickness, 0];
	const angleLength = tan * bottomMargin - (staveBottomThickness - 5); // angle-dependent extra length to plate
	const bottomPlatePoints = [
		angleLength,
		0,
		angleLength,
		-bottomThickness,
		-bottomDiameter - angleLength,
		-bottomThickness,
		-bottomDiameter - angleLength,
		0,
	];

	function LeftStave({ points, angle }: { points: number[]; angle: number }) {
		return (
			<Line rotation={-angle} fill={barrelColor} points={points} strokeWidth={stroke} stroke={'black'} closed></Line>
		);
	}

	function Outline({ points }: { points: number[] }) {
		return <Line fill={barrelColor} closed opacity={0.5} points={points} strokeWidth={stroke} stroke={'black'} />;
	}

	function RightStave({ x, points, angle }: { x: number; points: number[]; angle: number }) {
		return (
			<Line
				rotation={angle}
				x={x}
				fill={barrelColor}
				points={points}
				strokeWidth={stroke}
				stroke={'black'}
				closed
			></Line>
		);
	}

	function BottomPlate({ points }: { points: number[] }) {
		return (
			<Line
				x={bottomDiameter}
				y={-bottomMargin}
				fill={barrelColor}
				points={points}
				strokeWidth={stroke}
				stroke={'black'}
				closed
			></Line>
		);
	}

	function Apple({ x, y, visible, sizeMm }: { x: number; y: number; visible: boolean; sizeMm: number }) {
		const size = sizeMm;
		return (
			<Image
				alt="apple"
				visible={visible}
				opacity={0.3}
				x={x - (size * 0.5) - size}
				y={y - size + 4}
				image={image}
				width={size}
				height={size}
				// Add caching properties to improve performance
				listening={false}
				perfectDrawEnabled={false}
			/>
		);
	}

	// Image status is now handled by the cached hook

	return (
		<Group x={worldX} y={worldY}>
			<Group draggable>
				{useGrid && <Grid pixelsPerCm={pixelsPerCm} scale={scale} x={0} y={0} />}

				<Group scaleX={scale} scaleY={scale}>
					<Apple
						visible={imageStatus === 'loaded' ? true : false}
						x={-bottomDiameter * 0.8}
						y={height * 0.5}
						sizeMm={80}
					/>
					<Group x={-bottomDiameter * 0.5} y={height * 0.5}>
						<Outline points={outlinePoints} />
						<LeftStave points={leftStavePoints} angle={angle} />
						<RightStave points={rightStavePoints} angle={angle} x={bottomDiameter} />
						<BottomPlate points={bottomPlatePoints} />
					</Group>

					{useCross && <Cross color="green" />}
				</Group>
			</Group>

			{useRuler && (
				<Ruler
					x={-dimensions.width * 0.5 + 20.5}
					y={dimensions.height * 0.5 - 20.5}
					margin={25}
					scale={scale * pixelsPerMm}
					width={dimensions.width - 40}
					height={dimensions.height - 40}
					xLength={10}
					yLength={0}
				/>
			)}

			{useCross && <Cross color="red" />}
		</Group>
	);
}

export default BarrelSideview;
