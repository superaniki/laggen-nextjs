import { BarrelWithData, StaveCurveConfigWithData } from '@/db/queries/barrels';
import { BarrelDetails, StaveCurveConfig } from '@prisma/client';
import { create } from 'zustand';
import {
  applyBarrelHeight, applyBarrelTopDiameter, applyBarrelAngle,
  applyBarrelBottomDiameter, applyBarrelStaveLength
} from "../canvas/commons/barrel-math";

export type BarrelStore = {
  loadedBarrel: BarrelWithData | null;
  details: BarrelDetails | null;
  staveCurveConfig: StaveCurveConfigWithData | null;
  setBarrel: (barrel: BarrelWithData) => void;
  updateBarrelDetails: (name: string, value: boolean | string | number) => void;
  updateBarrelDetailsNumber: (name: string, value: number) => void;
  updateStaveCurve: (name: string, value: number | boolean) => void;
  updateStaveCurvePaper: (paperState: string) => void;
  //  getCount: () => number;
};

const useBarrelStore = create<BarrelStore>((set) => ({
  loadedBarrel: null,
  details: null,
  staveCurveConfig: null,
  setBarrel: (barrel) => set((state) => ({
    loadedBarrel: barrel,
    details: barrel.barrelDetails,
    staveCurveConfig: barrel.staveCurveConfig
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
  updateStaveCurve: (name, value) => set((state) => {

    if (state.staveCurveConfig === null)
      return {};

    const staveCurveConfig = state.staveCurveConfig;
    const configDetailsArray = [...state.staveCurveConfig.configDetails];

    const configDetails = configDetailsArray.find(item => (item.paperType === staveCurveConfig.defaultPaperType));
    if (configDetails === undefined)
      return {};

    const index = configDetailsArray.findIndex(item => (item.paperType === staveCurveConfig.defaultPaperType));
    configDetailsArray[index] = { ...configDetails, [name]: value };
    const updatedConfig = { ...state.staveCurveConfig, configDetails: [...configDetailsArray] }

    return {
      staveCurveConfig: updatedConfig
    }
  }),
  updateStaveCurvePaper: (paperState) => set((state) => {
    if (state.staveCurveConfig === null)
      return {};
    return {
      staveCurveConfig: { ...state.staveCurveConfig, defaultPaperType: paperState }
    }
  }),
  /*
    getCount: (state) => {
      return set.state.loadedBarrel;
    },*/

}));

export default useBarrelStore;





/*


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
