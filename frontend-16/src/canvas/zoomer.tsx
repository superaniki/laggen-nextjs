import Konva from 'konva';

// problematisk - fungerar dåligt pga får inte rätt invärden + typescript är knepigt.

type zoomerProps = {
	e: Konva.KonvaEventObject<WheelEvent>;
	node: Konva.Layer;
	oldScale: number;
	oldPosition: Konva.Vector2d;
};
function zoomer({ e, node, oldScale, oldPosition }: zoomerProps) {
	const scaleBy = 1.3;
	let pointer = node.getRelativePointerPosition();
	pointer = pointer || { x: 0, y: 0 };
	const mousePointTo = {
		x: (pointer.x - oldPosition.x) / oldScale,
		y: (pointer.y - oldPosition.y) / oldScale,
	};

	// how to scale? Zoom in? Or zoom out?
	const direction = e.evt.deltaY > 0 ? -1 : 1;
	const newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;
	const newPos: Konva.Vector2d = {
		x: pointer.x - mousePointTo.x * newScale,
		y: pointer.y - mousePointTo.y * newScale,
	};

	return [newScale, newPos];
}

export default zoomer;
