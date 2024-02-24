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
  //paperState: Paper,
  setViewState: (view: View) => void;
  setStaveToolState: (staveTool: StaveTool) => void;
};

const useEditStore = create<EditStore>((set) => {
  return {
    viewState: View.Barrel,
    staveToolState: StaveTool.Curve,
    //paperState: "A3" as Paper,
    setViewState: (view) => set((state) => {
      return {
        viewState: view
      }
    }),
    setStaveToolState: (staveTool) => set((state) => {
      //let newPaperState = null;
      //let config = null;
      /*switch (staveTool) {
        case StaveTool.Curve:
          config = useBarrelStore.getState().staveCurveConfig;
          //newPaperState = config?.defaultPaperType as Paper
          break;
        case StaveTool.Front:
          config = useBarrelStore.getState().staveFrontConfig;
          //newPaperState = config?.defaultPaperType as Paper
          break;
        case StaveTool.End:
          config = useBarrelStore.getState().staveEndConfig;
          //newPaperState = config?.defaultPaperType as Paper
          break;
        default:
          //newPaperState = Paper.A4;
      }*/
      return {
        staveToolState: staveTool,
        //paperState: newPaperState
      }
    }),
  }
});

export default useEditStore;
