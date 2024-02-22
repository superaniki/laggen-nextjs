import { useEffect, useState } from "react";
import useBarrelStore from "./barrel-store";
import useEditStore, { Paper, StaveTool } from "./edit-store";


export default function usePaperSize(defaultPaper?: Paper) {
  const { staveCurveConfig } = useBarrelStore();
  const { staveToolState } = useEditStore();
  const [paperSize, setPaperSize] = useState(Paper.A4);

  useEffect(() => {
    console.log
    let newPaperSize = null;
    switch (staveToolState) {
      case StaveTool.Curve:
        newPaperSize = staveCurveConfig?.defaultPaperType as Paper
        console.log("usePaperSize : " + newPaperSize)
      //case StaveTool.Front:
      //  return staveFrontConfig?.defaultPaperType as Paper
      /* **********  Fyll på  ******************
      case BarrelTool.StaveEnd:
      return
      
      */
     break;
      default:
        newPaperSize = Paper.A4;
    }
    setPaperSize(newPaperSize);
  }, [staveCurveConfig, staveToolState])

  return paperSize;
}