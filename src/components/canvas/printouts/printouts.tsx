import React from 'react';
import { Group } from 'react-konva';
import Grid from '../commons/grid';
import { useState, useEffect, useRef } from 'react';
import { A4, a4size } from '../commons/A4';
import PlaningTool from './types/planing-tool';
import StaveTemplate from './types/stave-front';
import StaveEnds from './types/stave-end';
import { Barrel } from '@prisma/client';
type PrintOuts = {
	barrel: Barrel,
	worldX: number;
	worldY: number;
	dimensions: { width: number; height: number };
	modifyScale: number;
	resetModifyScale: () => void;
};
const PrintOuts = ({ barrel, worldX, worldY, dimensions, modifyScale, resetModifyScale }: PrintOuts) => {

	const pixelsPerCm = 40;
	const pixelsPerMm = pixelsPerCm * 0.1;

	const [scale, setScale] = useState(0.3);
	const staveEndsRef = useRef(null);

	const [staveTemplateRotation, setStaveTemplateRotation] = useState(false);
	const [printScale, setPrintScale] = useState(1.8);
	const printMargins = 15;
	const maxArea = { width: a4size.width - printMargins, height: a4size.height - printMargins };

	useEffect(() => {
		setScale(scale + modifyScale);
		resetModifyScale();
	}, [modifyScale, scale, resetModifyScale]); // when text changes, it runs


	function PrintPreview() {
		//const offset = { offsetX: a4.width * 0.5, offsetY: a4.height * 0.5 };

		console.log("print preview")

		return (
			<Group x={0} y={0}>
				<A4 x={-250}>
					<StaveTemplate
						onClick={() => setStaveTemplateRotation(!staveTemplateRotation)}
						maxArea={maxArea}
						rotate={staveTemplateRotation}
						x={0}
						y={-300}
						scale={1}
						barrel={barrel}
						useCross
					/>
				</A4>
				<A4>
					<PlaningTool x={-80} y={120} barrel={barrel} scale={1} />
				</A4>
				<A4 x={250}>
					<StaveEnds scale={1} x={0} y={0} {...barrel} />
				</A4>
			</Group>
		);
	}

	return (
		<Group ref={staveEndsRef} x={worldX} y={worldY}>
			<Group draggable>
				<Grid
					pixelsPerCm={pixelsPerCm}
					scale={scale}
					x={20.5}
					y={-20.5}
				/>
				<Group scaleX={pixelsPerMm * scale} scaleY={pixelsPerMm * scale}>
					<PrintPreview />
				</Group>
			</Group>
		</Group>
	);
};

export default PrintOuts;
