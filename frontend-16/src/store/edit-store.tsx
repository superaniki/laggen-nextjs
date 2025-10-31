import { BarrelWithData, StaveCurveConfigWithData } from '@/db/queries/barrels';
import { BarrelDetails, StaveCurveConfig } from '@prisma/client';
import { create } from 'zustand';
//import { Paper } from '../canvas/printouts/on-paper';
import useBarrelStore, { BarrelStore } from './barrel-store';
import { StaveTool, View } from '@/common/enums';

type EditStore = {
  viewState: View,
  staveToolState: StaveTool,
  setViewState: (view: View) => void;
  setStaveToolState: (staveTool: StaveTool) => void;
};

const useEditStore = create<EditStore>((set) => {
  return {
    viewState: View.Barrel,
    staveToolState: StaveTool.Curve,
    setViewState: (view) => set((state) => {
      return {
        viewState: view
      }
    }),
    setStaveToolState: (staveTool) => set((state) => {
      return {
        staveToolState: staveTool,
      }
    }),
  }
});

export default useEditStore;
