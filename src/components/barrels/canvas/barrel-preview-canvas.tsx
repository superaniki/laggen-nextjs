"use client";
import React from 'react';
import { Stage, Layer } from 'react-konva';
import { useState, useRef, useEffect } from 'react';
import { BarrelDetails } from '@prisma/client';
import { ErrorBoundary } from 'react-error-boundary';
import SideViewPreview from './sideview/sideview-preview';

export default function BarrelPreviewCanvas({ barrelDetails, color }: { barrelDetails: BarrelDetails, color?: string; }) {
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
							barrelDetails={barrelDetails}
							color={color}
						/>
					</Layer>
				</Stage>
			</ErrorBoundary>

		</div>
	);
}