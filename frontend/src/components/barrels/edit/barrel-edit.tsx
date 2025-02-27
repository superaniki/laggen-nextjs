"use client";
import { useEffect, useState, useMemo } from "react";
import { Button, Card, Divider, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Radio, RadioGroup, useDisclosure } from "@nextui-org/react";
import { updateBarrel } from "@/actions";
import { useSession } from "next-auth/react";

import BarrelCanvas from "../canvas/barrel-canvas";
import OnPaper from "../canvas/printouts/on-paper";

import LoadingString from "@/ui/loading-string";
import FormButton from "@/ui/form-button";

import useBarrelStore from "@/store/barrel-store";
import useEditStore from "@/store/edit-store";
import usePaperSize from "@/hooks/usePaperSize";
import { getConfigDetails, paperSizeWithRotation, pixelsFromCm, saveImageToDisc, staveToolString } from "@/common/utils";
import { StaveTool, View } from "@/common/enums";
import { StaveCurveConfigDetails, StaveFrontConfigDetails, StaveEndConfigDetails } from "@prisma/client";
import { BarrelWithData } from "@/db/queries/barrels";

import { exportTemplateImage } from "../export-utils"; // Adjust path based on your folder structure
import { ZoomControl } from "../zoom-control";
import MainEditNav from "./partials/main-edit-nav";
import StaveToolNav from "./partials/stave-tool-nav";
import { StaveCurveConfig } from "./partials/stave-curve-config";
import { StaveFrontConfig } from "./partials/stave-front-config";
import { StaveEndConfig } from "./partials/stave-end-config";
import ExportModal from "./partials/export-modal";
import { BarrelDetailConfig } from "./partials/barrel-detail-config";


export default function BarrelEdit({ barrel }: { barrel: BarrelWithData }) {
  const { user, barrelDetails: loadedBarrelDetails, staveEndConfig: loadedStaveEndConfig, staveFrontConfig: loadedStaveFrontConfig, staveCurveConfig: loadedStaveCurveConfig, ...loadedBarrel } = { ...barrel };
  const { staveToolState, viewState } = useEditStore();
  const { setBarrel, details: barrelDetails, staveCurveConfig, staveFrontConfig, staveEndConfig } = useBarrelStore();
  const session = useSession();
  const [toolScale, setToolScale] = useState(2.4);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [dpi, setDpi] = useState("300");
  const [outputFormat, setOutputFormat] = useState("Png");
  const { staveToolState: tool } = useEditStore();
  const paperState = usePaperSize();
  const [isPendingGeneration, setIsPendingGeneration] = useState(false);
  const [exportIsAvailable, setExportIsAvailable] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState("");

  useEffect(() => {
    setBarrel(barrel);
  }, [setBarrel, barrel])

  const isSaveButtonEnabled = useMemo(() => {
    const testCurveEquality = (currentValue: StaveCurveConfigDetails, index: number) => {
      const test = JSON.stringify({ ...currentValue }) === JSON.stringify({ ...loadedStaveCurveConfig.configDetails[index] });
      return test;
    };
    const testFrontEquality = (currentValue: StaveFrontConfigDetails, index: number) => {
      const test = JSON.stringify({ ...currentValue }) === JSON.stringify({ ...loadedStaveFrontConfig.configDetails[index] });
      return test;
    };
    const testEndEquality = (currentValue: StaveEndConfigDetails, index: number) => {
      const test = JSON.stringify({ ...currentValue }) === JSON.stringify({ ...loadedStaveEndConfig.configDetails[index] });
      return test;
    };

    return (JSON.stringify({ ...barrelDetails }) !== JSON.stringify({ ...loadedBarrelDetails }) ||
      JSON.stringify({ ...staveCurveConfig }) !== JSON.stringify({ ...loadedStaveCurveConfig }) ||
      JSON.stringify({ ...staveFrontConfig }) !== JSON.stringify({ ...loadedStaveFrontConfig }) ||
      JSON.stringify({ ...staveEndConfig }) !== JSON.stringify({ ...loadedStaveEndConfig }) ||
      staveCurveConfig?.configDetails.every(testCurveEquality) ||
      staveFrontConfig?.configDetails.every(testFrontEquality) ||
      staveEndConfig?.configDetails.every(testEndEquality))
  }, [barrelDetails, staveCurveConfig, staveFrontConfig, staveEndConfig, loadedBarrelDetails, loadedStaveCurveConfig, loadedStaveFrontConfig, loadedStaveEndConfig]);


  if (!barrelDetails || !staveCurveConfig || !staveFrontConfig || !staveEndConfig)
    return <></>
  const configDetails = getConfigDetails(tool, staveCurveConfig, staveFrontConfig, staveEndConfig);
  if (configDetails === undefined)
    return <></>;
  const { height: paperHeight, width: paperWidth } = paperSizeWithRotation(configDetails.rotatePaper, paperState);

  console.log("paperHeight:", paperHeight, "paperWidth:", paperWidth);
  if (barrel === undefined)
    return <LoadingString />;

  if (staveCurveConfig === null || barrelDetails == null || staveFrontConfig === null || staveEndConfig === null)
    return <></>

  function dateString(milliSeconds: number) {
    const date = new Date(milliSeconds);
    const month = date.toLocaleString('en-us', { month: 'long' });
    return date.getDate() + ' of ' + month + ', ' + date.getFullYear();
  }

  function printPaperSizeInPixels() {
    const pxWidth = Math.floor(pixelsFromCm(Number(dpi), paperWidth * 0.1));
    const pxHeight = Math.floor(pixelsFromCm(Number(dpi), paperHeight * 0.1));
    return `Pixel size: ${pxWidth} x ${pxHeight}`;
  };

  function handleGenerate() {
    if (staveCurveConfig !== null && staveEndConfig !== null && staveFrontConfig !== null && staveEndConfig !== null && barrelDetails !== null) {
      exportTemplateImage(
        staveToolState,
        staveCurveConfig,
        staveEndConfig,
        staveFrontConfig,
        barrelDetails,
        outputFormat,
        dpi,
        setDownloadUrl,
        setExportIsAvailable,
        setIsPendingGeneration
      );
    }
  }

  return (
    <>
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
          <Card className="bg-gradient-to-t from-green-100 to-blue-100 items-center p-0">
            {viewState === View.Barrel && <BarrelCanvas barrel={barrelDetails} />}
            {viewState === View.Tools && (<>
              <div className="mt-4 shadow-medium">
                <OnPaper scale={toolScale} />
              </div>
              <Button className="my-4" onClick={onOpen}>Export</Button>
              <ExportModal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                onClose={onClose}
                staveToolState={staveToolString(staveToolState)}
                dpi={dpi}
                setDpi={setDpi}
                outputFormat={outputFormat}
                setOutputFormat={setOutputFormat}
                printPaperSizeInPixels={printPaperSizeInPixels}
                handleGenerate={handleGenerate}
                isPendingGeneration={isPendingGeneration}
                exportIsAvailable={exportIsAvailable}
                downloadUrl={downloadUrl}
                setExportIsAvailable={setExportIsAvailable}
              />

              <ZoomControl toolScale={toolScale} setToolScale={setToolScale} />
            </>
            )}
            {viewState === View.View3d && <>3d view</>}
          </Card>
        </div>

        <div className="col-span-2">
          <BarrelDetailConfig />
          <Divider className="my-4" />
          <form action={() => updateBarrel(loadedBarrel, barrelDetails, staveCurveConfig,
            staveCurveConfig.configDetails, staveFrontConfig, staveFrontConfig.configDetails,
            staveEndConfig, staveEndConfig.configDetails)}>
            {session.data?.user?.id === barrel.userId && <FormButton isDisabled={!isSaveButtonEnabled}>Save</FormButton>}
          </form>
          <div className="text-tiny mt-4 text-gray-500">Created : {dateString(barrel.createdAt.getTime())}</div>
          <div className="text-tiny text-gray-500">Last updated : {dateString(barrel.updatedAt.getTime())}</div>
        </div>
      </div >
    </>)
}

