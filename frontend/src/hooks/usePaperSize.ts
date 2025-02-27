import { useEffect, useState } from 'react';
import useBarrelStore from '@/store/barrel-store';
import useEditStore from '@/store/edit-store';
import { Paper, StaveTool } from '@/common/enums';

export default function usePaperSize(defaultPaper?: Paper) {
	const { staveCurveConfig, staveFrontConfig, staveEndConfig } = useBarrelStore();
	const { staveToolState } = useEditStore();
	const [paperSize, setPaperSize] = useState<Paper | null>(null);

	useEffect(() => {
		let newPaperSize: Paper | null = null;
		switch (staveToolState) {
			case StaveTool.Curve:
				newPaperSize = staveCurveConfig?.defaultPaperType as Paper;
				break;
			case StaveTool.Front:
				newPaperSize = staveFrontConfig?.defaultPaperType as Paper;
				break;
			case StaveTool.End:
				newPaperSize = staveEndConfig?.defaultPaperType as Paper;
				break;
		}

		if (newPaperSize !== null) {
			setPaperSize(newPaperSize);
		}
	}, [staveCurveConfig, staveFrontConfig, staveEndConfig, staveToolState]);

	return paperSize;
}
