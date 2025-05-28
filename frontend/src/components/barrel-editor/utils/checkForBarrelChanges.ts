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
  // Check if barrel details have changed
  const detailsChanged = JSON.stringify({ ...barrelDetails }) !== JSON.stringify({ ...loadedBarrelDetails });
  
  // Check if config objects have changed (excluding configDetails arrays)
  const curveConfigChanged = JSON.stringify({
    ...staveCurveConfig,
    configDetails: undefined
  }) !== JSON.stringify({
    ...loadedStaveCurveConfig,
    configDetails: undefined
  });
  
  const frontConfigChanged = JSON.stringify({
    ...staveFrontConfig,
    configDetails: undefined
  }) !== JSON.stringify({
    ...loadedStaveFrontConfig,
    configDetails: undefined
  });
  
  const endConfigChanged = JSON.stringify({
    ...staveEndConfig,
    configDetails: undefined
  }) !== JSON.stringify({
    ...loadedStaveEndConfig,
    configDetails: undefined
  });
  
  // Check if any configDetails have changed
  const curveDetailsChanged = staveCurveConfig?.configDetails?.some((val: any, idx: number) => 
    !checkConfigEquality.curve(val, loadedStaveCurveConfig.configDetails[idx]));
  
  const frontDetailsChanged = staveFrontConfig?.configDetails?.some((val: any, idx: number) => 
    !checkConfigEquality.front(val, loadedStaveFrontConfig.configDetails[idx]));
  
  const endDetailsChanged = staveEndConfig?.configDetails?.some((val: any, idx: number) => 
    !checkConfigEquality.end(val, loadedStaveEndConfig.configDetails[idx]));
  
  // Return true if any part has changed
  return detailsChanged || 
         curveConfigChanged || frontConfigChanged || endConfigChanged ||
         curveDetailsChanged || frontDetailsChanged || endDetailsChanged;
};