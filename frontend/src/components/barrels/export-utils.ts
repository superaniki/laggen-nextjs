import toast from 'react-hot-toast';
import { StaveTool } from '@/common/enums';
import { StaveCurveConfigWithData, StaveEndConfigWithData, StaveFrontConfigWithData } from '@/db/queries/barrels';
import paths from '@/paths';

interface ExportTemplateData {
	staveToolState: StaveTool;
	staveCurveConfig: StaveCurveConfigWithData;
	staveEndConfig: StaveEndConfigWithData;
	staveFrontConfig: StaveFrontConfigWithData;
	barrelDetails: any; // Replace 'any' with the appropriate type for barrelDetails
}

export async function exportTemplateImage(
	staveToolState: StaveTool,
	staveCurveConfig: StaveCurveConfigWithData,
	staveEndConfig: StaveEndConfigWithData,
	staveFrontConfig: StaveFrontConfigWithData,
	barrelDetails: any, // Replace 'any' with the appropriate type for barrelDetails
	outputFormat: string,
	dpi: string,
	setDownloadUrl: (url: string) => void,
	setExportIsAvailable: (status: boolean) => void,
	setIsPendingGeneration: (status: boolean) => void
) {
	try {
		setIsPendingGeneration(true);
		const jsonData: ExportTemplateData = {
			staveToolState,
			staveCurveConfig,
			staveEndConfig,
			staveFrontConfig,
			barrelDetails,
		};

		const response = await fetch(paths.export(), {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				format: outputFormat,
				dpi: dpi,
				barrel: jsonData,
			}),
		});

		var imageBuffer = await response.arrayBuffer();
		if (response.ok) {
			const dataUrl = `data:image/${outputFormat.toLowerCase()};base64,${Buffer.from(imageBuffer).toString('base64')}`;
			setDownloadUrl(dataUrl);
			setExportIsAvailable(true);
			toast.success('Export generation complete', { position: 'bottom-center' });
		} else {
			toast.error(response.status + ':' + response.statusText, {
				position: 'bottom-center',
			});
		}
		setIsPendingGeneration(false);
	} catch (error) {
		console.error('Error fetching image:', error);
		setIsPendingGeneration(false);
	}
}
