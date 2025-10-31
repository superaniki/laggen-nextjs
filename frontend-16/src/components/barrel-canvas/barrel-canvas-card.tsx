"use client";
import React from 'react';
import { Stage, Layer } from 'react-konva';
import { useState, useRef, useEffect } from 'react';
import { BarrelDetails } from '@prisma/client';
import { ErrorBoundary } from 'react-error-boundary';
import BarrelSideviewCard from './barrel-sideview-card';

// Use React.memo to prevent unnecessary re-renders
function BarrelPreviewCanvas({ barrelDetails, color, onLoad }: { barrelDetails: BarrelDetails, color?: string, onLoad?: () => void }) {
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

	// Notify parent when canvas is ready
	useEffect(() => {
		if (dimensions.width > 2 && dimensions.height > 2 && onLoad) {
			onLoad();
		}
	}, [dimensions, onLoad]);

	return (
		<div className="h-full" ref={ref}>
			<ErrorBoundary fallback={<div> Error rendering canvas.. </div>}>
				<Stage visible={true} width={dimensions.width} height={dimensions.height}>
					<Layer>
						<BarrelSideviewCard
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

// Export as memoized component to prevent unnecessary re-renders
export default BarrelPreviewCanvas;