import React from 'react';
import { Line, Group } from 'react-konva';
import { Image } from 'react-konva';
import useImage from 'use-image';
import { Barrel } from '@prisma/client';
import Cross from '../commons/cross';
import { findScaleToFit } from '../commons/barrel-math';

type SideViewPreviewProps = {
	viewWidth: number;
	viewHeight: number;
	worldX: number;
	worldY: number;
	barrel: Barrel;
	color?: string;
};

function SideViewPreview({ viewWidth, viewHeight, worldX, worldY, barrel, color }: SideViewPreviewProps) {
	const barrelColor = color === "undefined" ? '#000000' : color;
	const strokeWidth = 1;
	const strokeColor = "#888899";//color === "undefined" ? '#000000' : color;


	const url = 'apple.png';
	const [image, imageStatus] = useImage(url);

	const { angle, height, bottomDiameter, topDiameter } = { ...barrel };

	const tan = Math.tan((angle * Math.PI) / 180);
	const length = tan * height; // position till motsatt sida av vinkeln
	const outlinePoints = [0, 0, -length, -height, bottomDiameter + length, -height, bottomDiameter, 0];

	const width = bottomDiameter > topDiameter ? bottomDiameter : topDiameter;
	const scale = findScaleToFit({ width: viewWidth, height: viewHeight }, { width: width, height: height }, 0.6); // 20% margin
	const scaledPoints = outlinePoints.map((value) => value * scale);

	// 'round' | 'bevel' | 'miter';
	function Outline({ points }: { points: number[] }) {
		return (
			<Line
				lineJoin="round"
				fill={barrelColor}
				closed
				opacity={0.5}
				points={points}
				strokeWidth={strokeWidth}
				stroke={strokeColor}
			/>
		);
	}

	function Apple({ x, y, sizeMm }: { x: number; y: number; sizeMm: number }) {
		const size = sizeMm;
		return <Image alt="apple" opacity={0.7} x={x - size - size} y={y - size + 4} image={image} width={size} height={size} />;
	}

	return (
		<Group x={worldX} y={worldY}>
			<Group>
				<Group x={-bottomDiameter * 0.5 * scale} y={height * 0.5 * scale}>
					<Outline points={scaledPoints} />
				</Group>
				{imageStatus === 'loaded' && (
					<Apple x={bottomDiameter * -0.5 * scale} y={height * 0.5 * scale} sizeMm={80 * scale} />
				)}
			</Group>
		</Group>
	);
}

export default SideViewPreview;
/*	<Cross color="red" /> */
