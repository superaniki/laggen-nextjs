import React from 'react';
import { Group, Line } from 'react-konva';

type CrossProps = {
	visible?: boolean;
	x?: number;
	y?: number;
	color?: string;
};
function Cross({ visible = true, x = 0, y = 0, color = 'black' }: CrossProps) {
	return (
		<Group visible={visible} x={x} y={y}>
			<Line stroke={color} strokeWidth={1} points={[-10, 0, 10, 0]} />
			<Line stroke={color} strokeWidth={1} points={[0, -10, 0, 10]} />
		</Group>
	);
}

export default Cross;
