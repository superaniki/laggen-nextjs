import { StaveCurveConfigWithData, StaveEndConfigWithData, StaveFrontConfigWithData } from '@/db/queries/barrels';
import { Paper, StaveTool } from './enums';
import { PaperSizes } from './constants';

export function saveImageToDisc(buffer: ArrayBuffer, format: string) {
	const dataUrl = `data:image/${format.toLowerCase()};base64,${Buffer.from(buffer).toString('base64')}`;
	// Prompt user to save the image to disk
	const anchor = document.createElement('a');
	anchor.href = dataUrl;
	anchor.download = `toolthing.${format.toLowerCase()}`;
	anchor.click();
}

export function staveToolString(state: StaveTool) {
	switch (state) {
		case StaveTool.Curve:
			return 'Curve';
		case StaveTool.Front:
			return 'Front';
		case StaveTool.End:
			return 'End';
	}
}

export function pixelsFromCm(dpi: number, widthInCm: number) {
	const inchesPerCm = 2.54;
	const widthInInches = widthInCm / inchesPerCm;
	return pixelsFromDpi(dpi, widthInInches);
}

export function pixelsFromDpi(dpi: number, widthInInches: number) {
	return dpi * widthInInches;
}

export function getConfigDetails(
	tool: StaveTool,
	staveCurveConfig: StaveCurveConfigWithData,
	staveFrontConfig: StaveFrontConfigWithData,
	staveEndConfig: StaveEndConfigWithData
) {
	let configDetails = null;
	let configDetailsDataArray = null;
	switch (tool) {
		case StaveTool.Curve:
			configDetailsDataArray = staveCurveConfig.configDetails;
			configDetails = configDetailsDataArray.find((item) => item.paperType === staveCurveConfig.defaultPaperType);
			break;
		case StaveTool.Front:
			configDetailsDataArray = staveFrontConfig.configDetails;
			configDetails = configDetailsDataArray.find((item) => item.paperType === staveFrontConfig.defaultPaperType);
			break;
		case StaveTool.End:
			configDetailsDataArray = staveEndConfig.configDetails;
			configDetails = configDetailsDataArray.find((item) => item.paperType === staveEndConfig.defaultPaperType);
			break;
	}

	return configDetails;
}

export function paperSizeWithRotation(rotate: boolean, paperState: Paper) {
	if (paperState == undefined) {
		return { width: 0, height: 0 };
	}
	let paperWidth = PaperSizes[paperState].width;
	let paperHeight = PaperSizes[paperState].height;
	if (rotate) {
		paperWidth = PaperSizes[paperState].height;
		paperHeight = PaperSizes[paperState].width;
	}
	return { width: paperWidth, height: paperHeight };
}
