import { PrintoutCanvas } from './printout-canvas';
import useEditStore from "@/store/edit-store";
import useBarrelStore from "@/store/barrel-store";
import usePaperSize from "@/hooks/usePaperSize";

interface PrintoutCanvasContainerProps {
  scale?: number;
}

export function PrintoutCanvasContainer({ scale }: PrintoutCanvasContainerProps) {
  const { details: barrelDetails, staveCurveConfig, staveFrontConfig, staveEndConfig } = useBarrelStore();
  const { staveToolState: currentTool } = useEditStore();
  const paperSize = usePaperSize();

  if (!barrelDetails || !staveCurveConfig || !staveFrontConfig || !staveEndConfig || !paperSize) {
    return null;
  }

  return (
    <PrintoutCanvas
      scale={scale}
      barrelDetails={barrelDetails}
      staveCurveConfig={staveCurveConfig}
      staveFrontConfig={staveFrontConfig}
      staveEndConfig={staveEndConfig}
      currentTool={currentTool}
      paperSize={paperSize}
    />
  );
}