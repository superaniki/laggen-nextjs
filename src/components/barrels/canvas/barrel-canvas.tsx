import { Stage, Layer } from 'react-konva';
import { useState, useEffect, useRef } from 'react';
import SideView from './barrel/sideview';
import { BarrelDetails } from '@prisma/client';
import { ErrorBoundary } from "react-error-boundary";

export default function BarrelCanvas({
	barrel,
	useGrid = true
}: {
	barrel: BarrelDetails
	useGrid?: boolean
}) {
	const ref = useRef<HTMLDivElement>(null);
	const [dimensions, setDimensions] = useState({ width: 2, height: 2 });

	useEffect(() => {
		const getDimensions = () => {
			if (ref.current) {
				const { offsetWidth, offsetHeight } = ref.current;
				console.log('ref.current.offsetWidth :', offsetWidth);
				return { width: offsetWidth, height: offsetHeight };
			}
			return { width: 0, height: 0 };
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


	const worldX = dimensions.width * 0.5;
	const worldY = dimensions.height * 0.5;

	console.log("dimx: ", dimensions.width)



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
						<SideView
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
}

/*

const [scale, setScale] = useState(0);

	function resetScale() {
		setScale(0);
	}
	/*
	function handleKeyDown(e: KeyboardEvent) {
		if (e.keyCode == 189) setScale(-0.1);
		if (e.keyCode == 187) setScale(0.1);
	}
	*/
