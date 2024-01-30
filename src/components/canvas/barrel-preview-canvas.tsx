"use client";
import React from 'react';
import { Stage, Layer } from 'react-konva';
import { useState, useRef, useEffect } from 'react';
import SideViewPreview from './barrel/sideview-preview';
import { Barrel } from '@prisma/client';
import { ErrorBoundary } from 'react-error-boundary';

export default function BarrelPreviewCanvas({ barrel, color }: { barrel: Barrel, color?: string; }) {
	const ref = useRef<HTMLDivElement | null>(null);
	const [dimensions, setDimensions] = useState({ width: 2, height: 2 });

	useEffect(() => {
		const getDimensions = () => {
			let offset = {
				width: 0,
				height: 0,
			};
			if (ref.current != undefined) offset = { width: ref.current.offsetWidth, height: ref.current.offsetHeight };

			return offset;
		};

		const handleResize = () => {
			setDimensions(getDimensions());
		};

		if (ref.current) {
			setDimensions(getDimensions());
		}

		window.addEventListener('resize', handleResize);
		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, [ref]);

	return (
		<div className="h-full" ref={ref}>
			<ErrorBoundary fallback={<div> Error rendering canvas.. </div>}>
				<Stage visible={true} width={dimensions.width} height={dimensions.height}>
					<Layer>
						<SideViewPreview
							viewWidth={dimensions.width}
							viewHeight={dimensions.height}
							worldX={dimensions.width * 0.5}
							worldY={dimensions.height * 0.5}
							barrel={barrel}
							color={color}
						/>
					</Layer>
				</Stage>
			</ErrorBoundary>

		</div>
	);
}


/*

					<ToolView
						visible={view === Views.ToolView}
						{...barrel}
						worldX={dimensions.width / 2}
						worldY={dimensions.height * 0.5}
						dimensions={dimensions}
						modifyScale={scale}
						resetModifyScale={resetScale}
					/>

*/
