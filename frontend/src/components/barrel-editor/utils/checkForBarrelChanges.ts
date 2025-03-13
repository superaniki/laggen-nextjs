import { StaveCurveConfigDetails, StaveFrontConfigDetails, StaveEndConfigDetails } from "@prisma/client";

export const checkConfigEquality = {
  curve: (currentValue: StaveCurveConfigDetails, loadedValue: StaveCurveConfigDetails) => {
    return JSON.stringify({ ...currentValue }) === JSON.stringify({ ...loadedValue });
  },
  
  front: (currentValue: StaveFrontConfigDetails, loadedValue: StaveFrontConfigDetails) => {
    return JSON.stringify({ ...currentValue }) === JSON.stringify({ ...loadedValue });
  },
  
  end: (currentValue: StaveEndConfigDetails, loadedValue: StaveEndConfigDetails) => {
    return JSON.stringify({ ...currentValue }) === JSON.stringify({ ...loadedValue });
  }
};

export const checkForBarrelChanges = (
  barrelDetails: any,
  loadedBarrelDetails: any,
  staveCurveConfig: any,
  loadedStaveCurveConfig: any,
  staveFrontConfig: any,
  loadedStaveFrontConfig: any,
  staveEndConfig: any,
  loadedStaveEndConfig: any
) => {
  return (
    JSON.stringify({ ...barrelDetails }) !== JSON.stringify({ ...loadedBarrelDetails }) ||
    JSON.stringify({ ...staveCurveConfig }) !== JSON.stringify({ ...loadedStaveCurveConfig }) ||
    JSON.stringify({ ...staveFrontConfig }) !== JSON.stringify({ ...loadedStaveFrontConfig }) ||
    JSON.stringify({ ...staveEndConfig }) !== JSON.stringify({ ...loadedStaveEndConfig }) ||
    staveCurveConfig?.configDetails.every((val: any, idx: number) => 
      checkConfigEquality.curve(val, loadedStaveCurveConfig.configDetails[idx])) ||
    staveFrontConfig?.configDetails.every((val: any, idx: number) => 
      checkConfigEquality.front(val, loadedStaveFrontConfig.configDetails[idx])) ||
    staveEndConfig?.configDetails.every((val: any, idx: number) => 
      checkConfigEquality.end(val, loadedStaveEndConfig.configDetails[idx]))
  );
};