import { useEffect, useState } from "react";
import useBarrelStore from "@/store/barrel-store";
import useEditStore, { Paper, StaveTool } from "@/store/edit-store";

export default function usePaperSize(defaultPaper?: Paper) {
  const { staveCurveConfig, staveFrontConfig, staveEndConfig } = useBarrelStore();
  const { staveToolState } = useEditStore();
  const [paperSize, setPaperSize] = useState(Paper.A4);

  useEffect(() => {
    let newPaperSize = null;
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
      default:
        newPaperSize = Paper.A4;
    }
    setPaperSize(newPaperSize);
  }, [staveCurveConfig, staveFrontConfig, staveEndConfig, staveToolState])

  return paperSize;
}