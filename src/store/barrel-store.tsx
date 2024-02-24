import { BarrelWithData, StaveCurveConfigWithData, StaveEndConfigWithData, StaveFrontConfigWithData } from '@/db/queries/barrels';
import { BarrelDetails, StaveCurveConfigDetails, StaveFrontConfigDetails } from '@prisma/client';
import { create } from 'zustand';
import {
  applyBarrelHeight, applyBarrelTopDiameter, applyBarrelAngle,
  applyBarrelBottomDiameter, applyBarrelStaveLength
} from '@/components/canvas/commons/barrel-math';
import { StaveTool } from './edit-store';
import { StaveCurveConfig } from '@/components/barrels/edit-partials/stave-curve-config';

export type BarrelStore = {
  loadedBarrel: BarrelWithData | null;
  details: BarrelDetails | null;
  staveCurveConfig: StaveCurveConfigWithData | null;
  staveFrontConfig: StaveFrontConfigWithData | null;
  staveEndConfig: StaveEndConfigWithData | null;
  setBarrel: (barrel: BarrelWithData) => void;
  updateBarrelDetails: (name: string, value: boolean | string | number) => void;
  updateBarrelDetailsNumber: (name: string, value: number) => void;
  updatePaperState: (toolState: StaveTool, paperState: string) => void;
  updateToolDetails: (tool: StaveTool, name: string, value: number | boolean) => void;
};

const useBarrelStore = create<BarrelStore>((set) => {
  function updateToolConfig(name: string, value: number | boolean,
    toolConfig: StaveCurveConfigWithData | StaveFrontConfigWithData | StaveEndConfigWithData)
    : StaveCurveConfigWithData | StaveFrontConfigWithData | StaveEndConfigWithData | null {

    const configDetailsArray = [...toolConfig.configDetails];

    const configDetails = configDetailsArray.find(item => (item.paperType === toolConfig.defaultPaperType));
    if (configDetails === undefined)
      return null;

    const index = configDetailsArray.findIndex(item => (item.paperType === toolConfig.defaultPaperType));
    configDetailsArray[index] = { ...configDetails, [name]: value }

    return { ...toolConfig, configDetails: [...configDetailsArray] } as
      StaveCurveConfigWithData | StaveFrontConfigWithData | StaveEndConfigWithData;
  }

  return {
    loadedBarrel: null,
    details: null,
    staveCurveConfig: null,
    staveFrontConfig: null,
    staveEndConfig: null,
    setBarrel: (barrel) => set((state) => ({
      loadedBarrel: barrel,
      details: barrel.barrelDetails,
      staveCurveConfig: barrel.staveCurveConfig,
      staveFrontConfig: barrel.staveFrontConfig,
      staveEndConfig: barrel.staveEndConfig
    })),
    updateBarrelDetails: (name, value) => set((state) => {
      if (state.details === null)
        return {};
      return {
        details: { ...state.details, [name]: value }
      }
    }),
    updateBarrelDetailsNumber: (name, value) => set((state) => {
      if (state.details === null)
        return {};

      let updatedBarrelDetails = null;
      switch (name.toLowerCase()) {
        case "height":
          updatedBarrelDetails = { ...applyBarrelHeight(value, state.details) }
          break;
        case "topdiameter":
          updatedBarrelDetails = { ...applyBarrelTopDiameter(value, state.details) }
          break;
        case "angle":
          updatedBarrelDetails = { ...applyBarrelAngle(value, state.details) }
          break;
        case "bottomdiameter":
          updatedBarrelDetails = { ...applyBarrelBottomDiameter(value, state.details) }
          break;
        case "stavelength":
          updatedBarrelDetails = { ...applyBarrelStaveLength(value, state.details) }
          break;
        default:
          updatedBarrelDetails = { ...state.details, [name]: value }
      }
      return {
        details: updatedBarrelDetails
      }
    }),
    updateToolDetails: (tool, name, value) => set((state) => {
      switch (tool) {
        case StaveTool.Curve:
          if (state.staveCurveConfig !== null)
            return { staveCurveConfig: updateToolConfig(name, value, state.staveCurveConfig) as StaveCurveConfigWithData };
          break;
        case StaveTool.Front:
          if (state.staveFrontConfig !== null)
            return { staveFrontConfig: updateToolConfig(name, value, state.staveFrontConfig) as StaveFrontConfigWithData };
          break;
        case StaveTool.End:
          if (state.staveEndConfig !== null)
            return { staveEndConfig: updateToolConfig(name, value, state.staveEndConfig) as StaveEndConfigWithData };
          break;
        default:
          return {};
      }
      return {};
    }),
    updatePaperState: (toolState, paperState) => set((state) => {
      switch (toolState) {
        case StaveTool.Curve:
          if (state.staveCurveConfig !== null)
            return {
              staveCurveConfig: { ...state.staveCurveConfig, defaultPaperType: paperState }
            }
        case StaveTool.Front:
          if (state.staveFrontConfig !== null)
            return {
              staveFrontConfig: { ...state.staveFrontConfig, defaultPaperType: paperState }
            }
        case StaveTool.End:
          if (state.staveEndConfig !== null)
            return {
              staveEndConfig: { ...state.staveEndConfig, defaultPaperType: paperState }
            }
        default:
          return {};
      }
    })
  }
});

export default useBarrelStore;





/*
    
                  let config = state.staveCurveConfig;
                  configDetailsArray = [...state.staveCurveConfig.configDetails];
        
                  const configDetails = configDetailsArray.find(item => (item.paperType === config.defaultPaperType));
                  if (configDetails === undefined)
                    return {};
        
                  const index = configDetailsArray.findIndex(item => (item.paperType === config.defaultPaperType));
                  configDetailsArray[index] = { ...configDetails, [name]: value };
                  const updatedConfig = { ...state.staveCurveConfig, configDetails: [...configDetailsArray] }
                  return {
                    staveCurveConfig: updatedConfig
                  }





  getCount: () => {
    return set((state) => state.count);
  },


 updateBarrelDetails: () => set((state) => {
      const newCount = state.count + 1;
      return {
        count: newCount,
        doubleCount: newCount * 2, // Set doubleCount based on count
      };
    }),


const { user, barrelDetails, staveCurveConfig, ...onlyBarrel } = { ...barrel };
const { configDetails, ...onlyStaveCurveConfig } = { ...staveCurveConfig }

const [editedBarrelDetails, setEditedBarrelDetails] = useState<BarrelDetails>(barrelDetails);
const [editedStaveCurveConfig, setEditedStaveCurveConfig] = useState<StaveCurveConfigWithData>(staveCurveConfig);

const [viewState, setViewState] = useState(View.Barrel);
const [barrelToolState, setbarrelToolState] = useState<BarrelTool>(BarrelTool.StaveFront);
*/
