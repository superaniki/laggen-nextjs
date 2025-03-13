"use client";
import { useEffect, useState, useMemo } from "react";
import { Divider } from "@nextui-org/react";
import { BarrelWithData } from "@/db/queries/barrels";
import useBarrelStore from "@/store/barrel-store";
import useEditStore from "@/store/edit-store";
import usePaperSize from "@/hooks/usePaperSize";
import { getConfigDetails, paperSizeWithRotation } from "@/common/utils";
import { StaveTool, View } from "@/common/enums";
import LoadingString from "@/ui/loading-string";
import { checkBarrelChanges } from "./utils/barrel-equality";
import MainEditNav from "./main-edit-nav";
import StaveToolNav from "./stave-tool-nav";
import { StaveCurveConfig } from "./stave-curve-config";
import { StaveFrontConfig } from "./stave-front-config";
import { StaveEndConfig } from "./stave-end-config";
import { BarrelContent } from "./barrel-content";
import { BarrelSave } from "./barrel-save";

export default function BarrelEdit({ barrel }: { barrel: BarrelWithData }) {
  const { user, barrelDetails: loadedBarrelDetails, staveEndConfig: loadedStaveEndConfig, 
    staveFrontConfig: loadedStaveFrontConfig, staveCurveConfig: loadedStaveCurveConfig } = barrel;
  const { staveToolState, viewState } = useEditStore();
  const { setBarrel, details: barrelDetails, staveCurveConfig, staveFrontConfig, staveEndConfig } = useBarrelStore();
  const [toolScale, setToolScale] = useState(2.4);
  const { staveToolState: tool } = useEditStore();
  const paperState = usePaperSize();

  useEffect(() => {
    setBarrel(barrel);
  }, [setBarrel, barrel]);

  const isSaveButtonEnabled = useMemo(() => 
    checkBarrelChanges(
      barrelDetails,
      loadedBarrelDetails,
      staveCurveConfig,
      loadedStaveCurveConfig,
      staveFrontConfig,
      loadedStaveFrontConfig,
      staveEndConfig,
      loadedStaveEndConfig
    ),
    [barrelDetails, staveCurveConfig, staveFrontConfig, staveEndConfig, 
     loadedBarrelDetails, loadedStaveCurveConfig, loadedStaveFrontConfig, loadedStaveEndConfig]
  );

  if (!barrelDetails || !staveCurveConfig || !staveFrontConfig || !staveEndConfig)
    return <></>;
    
  const configDetails = getConfigDetails(tool, staveCurveConfig, staveFrontConfig, staveEndConfig);
  if (configDetails === undefined)
    return <></>;
    
  const { height: paperHeight, width: paperWidth } = paperSizeWithRotation(configDetails.rotatePaper, paperState);

  if (barrel === undefined)
    return <LoadingString />;

  const barrelExportData = {
    staveToolState,
    staveCurveConfig,
    staveFrontConfig,
    staveEndConfig,
    barrelDetails,
  };

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-2 grid content-start gap-2 relative">
        <MainEditNav />
        <Divider className="box-content my-4 mx-2 w-auto" />
        <StaveToolNav />

        <div className={`grid gap-2 relative ${viewState !== View.Tools && "opacity-0"}`}>
          <Divider className="box-content my-4 mx-2 w-auto" />
          {staveToolState === StaveTool.Curve && <StaveCurveConfig />}
          {staveToolState === StaveTool.Front && <StaveFrontConfig />}
          {staveToolState === StaveTool.End && <StaveEndConfig />}
        </div>
      </div>

      <div className="col-span-8">
        <BarrelContent
          viewState={viewState}
          barrelDetails={barrelDetails}
          toolScale={toolScale}
          setToolScale={setToolScale}
          staveToolState={staveToolState}
          paperWidth={paperWidth}
          paperHeight={paperHeight}
          barrelExportData={barrelExportData}
        />
      </div>

      <div className="col-span-2">
        <BarrelDetailConfig />
        <Divider className="my-4" />
        <BarrelSave
          barrel={barrel}
          barrelDetails={barrelDetails}
          staveCurveConfig={staveCurveConfig}
          staveFrontConfig={staveFrontConfig}
          staveEndConfig={staveEndConfig}
          isSaveButtonEnabled={isSaveButtonEnabled}
        />
      </div>
    </div>
  );
}