import { Stage, Layer } from 'react-konva';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { BarrelDetails } from '@prisma/client';
import { ErrorBoundary } from "react-error-boundary";
import BarrelSideview from './barrel-sideview';

// Simple debounce function to limit resize events
function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
	let timeout: NodeJS.Timeout | null = null;
	return function(...args: Parameters<T>) {
		if (timeout) clearTimeout(timeout);
		timeout = setTimeout(() => func(...args), wait);
	};
}

// Use React.memo to prevent unnecessary re-renders
const BarrelCanvas = React.memo(function BarrelCanvas({
	barrel,
	useGrid = true
}: {
	barrel: BarrelDetails
	useGrid?: boolean
}) {
	const ref = useRef<HTMLDivElement>(null);
	const [dimensions, setDimensions] = useState({ width: 2, height: 2 });

	const getDimensions = useCallback(() => {
		if (ref.current) {
			const { offsetWidth, offsetHeight } = ref.current;
			return { width: offsetWidth, height: offsetHeight };
		}
		return { width: 0, height: 0 };
	}, []);

	// Create a debounced resize handler to improve performance
	const handleResize = useCallback(
		debounce(() => {
			setDimensions(getDimensions());
		}, 100), // 100ms debounce
		[getDimensions]
	);

	useEffect(() => {
		// Set initial dimensions
		if (ref.current) {
			setDimensions(getDimensions());
		}

		// Add debounced resize listener
		window.addEventListener('resize', handleResize);
		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, [getDimensions, handleResize]);

	const worldX = dimensions.width * 0.5;
	const worldY = dimensions.height * 0.5;
	interface FallbackProps {
		error: Error;
		resetErrorBoundary: () => void;
	}

	const MyFallbackComponent: React.FC<FallbackProps> = ({ error, resetErrorBoundary }) => {
		return (
			<div role="alert">
				<p>Something went wrong:</p>
				<pre>{error.message}</pre>
				<button onClick={resetErrorBoundary}>Try again</button>
			</div>
		);
	};

	return (
		<div ref={ref} className="h-[800px] w-full" tabIndex={0}>
			<ErrorBoundary FallbackComponent={MyFallbackComponent}>
				<Stage width={dimensions.width} height={dimensions.height}>
					<Layer>
						<BarrelSideview
							worldX={worldX}
							worldY={worldY}
							{...barrel}
							dimensions={dimensions}
							barrel={barrel}
							useGrid={useGrid}
							useRuler={true}
						/>
					</Layer>
				</Stage>
			</ErrorBoundary>
		</div>
	);
});

export default BarrelCanvas;