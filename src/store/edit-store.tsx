import { BarrelWithData, StaveCurveConfigWithData } from '@/db/queries/barrels';
import { BarrelDetails, StaveCurveConfig } from '@prisma/client';
import { create } from 'zustand';
//import { Paper } from '../canvas/printouts/on-paper';
import useBarrelStore, { BarrelStore } from './barrel-store';

export enum View {
  Barrel,
  Tools,
  View3d
}

export enum StaveTool {
  Curve,
  Front,
  End
}

export enum Paper {
  A3 = "A3",
  A4 = "A4"
}

type EditStore = {
  viewState: View,
  staveToolState: StaveTool,
  paperState: Paper,
  setViewState: (view: View) => void;
  setStaveToolState: (staveTool: StaveTool) => void;
};

const useEditStore = create<EditStore>((set) => {
  return {
    viewState: View.Barrel,
    staveToolState: StaveTool.Curve,
    paperState: "A3" as Paper,
    setViewState: (view) => set((state) => {
      return {
        viewState: view
      }
    }),
    setStaveToolState: (staveTool) => set((state) => {
      let newPaperState = null;
      switch (staveTool) {
        case StaveTool.Curve:
          const config = useBarrelStore.getState().staveCurveConfig;
          newPaperState = config?.defaultPaperType as Paper
          //case StaveTool.Front:
          //  return staveFrontConfig?.defaultPaperType as Paper
          /* **********  Fyll på  ******************
          case BarrelTool.StaveEnd:
          return
          
          */
          break;
        default:
          newPaperState = Paper.A4;
      }

      return {
        staveToolState: staveTool,
        paperState: newPaperState
      }
    }),
  }
});

export default useEditStore;
