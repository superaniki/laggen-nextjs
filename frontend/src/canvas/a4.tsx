import React from 'react';
import { Group, Rect } from 'react-konva';

export const a4size = {
	width: 210,
	height: 297,
};

type A4Props = {
	x?: number;
	y?: number;
	children?: React.ReactNode;
};

function A4({ x = 0, y = 0, children }: A4Props) {
	const offset = { offsetX: a4size.width * 0.5, offsetY: a4size.height * 0.5 };

	return (
		<Group
			x={x}
			y={y}
			width={100}
			clipX={-offset.offsetX}
			clipY={-offset.offsetY}
			clipWidth={a4size.width}
			clipHeight={a4size.height}
		>
			<Rect {...offset} {...a4size} stroke={'black'} strokeWidth={0.5} fill="white" />
			{children}
		</Group>
	);
}

export { A4 };
