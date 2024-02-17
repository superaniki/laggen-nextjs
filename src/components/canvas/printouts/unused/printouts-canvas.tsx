/*import { Stage, Layer } from 'react-konva';
import { useEffect, useRef, useState } from 'react';
import { Barrel } from '@prisma/client';
import PrintOuts from './printouts-multi';
import PrintOutsMulti from './printouts-multi';

function PrintoutsCanvas({
	barrel,
}: {
	barrel: Barrel;
}) {
	const [scale, setScale] = useState(0);
	const [dimensions, setDimensions] = useState({ width: 2, height: 2 });
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const getDimensions = () => {
			let offset = {
				width: 0,
				height: 0,
			};
			if (ref.current !== undefined) {
				console.log('ref.current.offsetWidth :', ref.current?.offsetWidth);
				if (ref.current)
					offset = { width: ref.current.offsetWidth, height: ref.current.offsetHeight };
			}

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
	function resetScale() {
		setScale(0);
	}

	const worldX = dimensions.width * 0.5;
	const worldY = dimensions.height * 0.5;

	return (
		<div ref={ref} className="h-[800px] w-full" tabIndex={0}>
			<Stage width={dimensions.width} height={dimensions.height}>
				<Layer>
					<PrintOutsMulti
						barrel={barrel}
						worldX={worldX}
						worldY={worldY}
						dimensions={dimensions}
						modifyScale={scale}
						resetModifyScale={resetScale}
					/>
				</Layer>
			</Stage>
		</div>

	);
}

export { PrintoutsCanvas };
*/

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
