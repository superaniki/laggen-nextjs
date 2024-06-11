"use client";
import BarrelCanvas from "../canvas/barrel-canvas";
import { ChangeEvent, useEffect, useState } from "react";
import { Button, Card, Divider, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Radio, RadioGroup, useDisclosure } from "@nextui-org/react";
import { updateBarrel } from "@/actions";
import FormButton from "../common/form-button";
import { useSession } from "next-auth/react";
import { BarrelWithData, } from "@/db/queries/barrels";
import LoadingString from "../common/loading-string";
import OnPaper from "../canvas/printouts/on-paper";
import { StaveCurveConfigDetails, StaveEndConfigDetails, StaveFrontConfigDetails } from "@prisma/client";
import { BarrelDetailForm } from "./edit-partials/barrel-detail-form";
import { StaveCurveConfig } from "./edit-partials/stave-curve-config";
import useBarrelStore from "@/store/barrel-store";
import MainEditNav from "./edit-partials/main-edit-nav";
import StaveToolNav from "./edit-partials/stave-tool-nav";
import useEditStore from "@/store/edit-store";
import { StaveFrontConfig } from "./edit-partials/stave-front-config";
import { StaveEndConfig } from "./edit-partials/stave-end-config";
import { StaveTool, View } from "@/common/enums";
import { round } from "../canvas/commons/barrel-math";
import { getConfigDetails, paperSizeWithRotation, pixelsFromCm, saveImageToDisc, staveToolString } from "@/common/utils";
import FormInput from "../common/form-input";
import { headers } from "next/headers";
import usePaperSize from "../hooks/usePaperSize";
import { PaperSizes } from "@/common/constants";
import toast from "react-hot-toast";
import ExportButton from "../common/export-button";

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

  if (!barrelDetails || !staveCurveConfig || !staveFrontConfig || !staveEndConfig)
    return <></>
  const configDetails = getConfigDetails(tool, staveCurveConfig, staveFrontConfig, staveEndConfig);
  if (configDetails === undefined)
    return <></>;
  const { height: paperHeight, width: paperWidth } = paperSizeWithRotation(configDetails.rotatePaper, paperState);

  if (barrel === undefined)
    return <LoadingString />;

  if (staveCurveConfig === null || barrelDetails == null || staveFrontConfig === null || staveEndConfig === null)
    return <></>

  function dateString(milliSeconds: number) {
    const date = new Date(milliSeconds);
    const month = date.toLocaleString('en-us', { month: 'long' });
    return date.getDate() + ' of ' + month + ', ' + date.getFullYear();
  }

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

  let enableSaveButton = false;
  if (JSON.stringify({ ...barrelDetails }) !== JSON.stringify({ ...loadedBarrelDetails }) ||
    JSON.stringify({ ...staveCurveConfig }) !== JSON.stringify({ ...loadedStaveCurveConfig }) ||
    JSON.stringify({ ...staveFrontConfig }) !== JSON.stringify({ ...loadedStaveFrontConfig }) ||
    JSON.stringify({ ...staveEndConfig }) !== JSON.stringify({ ...loadedStaveEndConfig }) ||
    !staveCurveConfig.configDetails.every(testCurveEquality) ||
    !staveFrontConfig.configDetails.every(testFrontEquality) ||
    !staveEndConfig.configDetails.every(testEndEquality)) {
    enableSaveButton = true;
  }

  async function exportTemplateImage() {
    try {
      setIsPendingGeneration(true);
      const jsonData = { staveToolState, staveCurveConfig, staveEndConfig, staveFrontConfig, barrelDetails }; // Your JSON data object

      const response = await fetch('/api/barrels/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ format: outputFormat, dpi: dpi, barrel: jsonData }),
      });

      var imageBuffer = await response.arrayBuffer();
      if (response.ok) {
        //saveImageToDisc(imageBuffer, outputFormat);
        //export function saveImageToDisc(buffer: ArrayBuffer, format: string) {
        const dataUrl = `data:image/${outputFormat.toLowerCase()};base64,${Buffer.from(imageBuffer).toString('base64')}`;
        setDownloadUrl(dataUrl);
        setExportIsAvailable(true);
        toast.success("Export generation complete", { position: 'bottom-center' });
      } else {
        response.status
        toast.error(response.status + ":" + response.statusText
          , { position: 'bottom-center' });
      }
      setIsPendingGeneration(false);
    }
    catch (error) {
      console.error('Error fetching image:', error);
      setIsPendingGeneration(false);
    }
  };

  function handleGenerate() {
    exportTemplateImage();
  }

  function printPaperSizeInPixels() {

    const pxWidth = Math.floor(pixelsFromCm(Number(dpi), paperWidth * 0.1));
    const pxHeight = Math.floor(pixelsFromCm(Number(dpi), paperHeight * 0.1));

    return `Pixel size: ${pxWidth} x ${pxHeight}`;
  };



  return (
    <>
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-2 grid content-start gap-2 relative">
          <MainEditNav />
          <Divider className="box-content my-4 mx-2 w-auto" />
          <StaveToolNav />

          <div className={`grid gap-2 relative ${viewState !== View.Tools && "opacity-0"}`}>
            <Divider className="box-content my-4 mx-2 w-auto" />

            {staveToolState === StaveTool.Curve && (
              <StaveCurveConfig />
            )}
            {staveToolState === StaveTool.Front && (
              <StaveFrontConfig />
            )}
            {staveToolState === StaveTool.End && (
              <StaveEndConfig />
            )}
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

              <Modal isOpen={isOpen} onOpenChange={onOpenChange} onClose={() => setExportIsAvailable(false)}>
                <ModalContent>
                  {(onClose) => (
                    <>
                      <ModalHeader className="flex flex-col gap-1">
                        {`Export : ${staveToolString(staveToolState)} template`}
                      </ModalHeader>
                      <ModalBody>
                        <FormInput step={50} callback={e => { setDpi(e.target.value); setExportIsAvailable(false) }} name={"dpi"} value={dpi} type={"number"} />
                        <div className="text-xs text-gray-500">{`${printPaperSizeInPixels()}`}</div>
                        <RadioGroup onChange={e => setOutputFormat(e.target.value)} label="Output format" defaultValue={outputFormat}
                        >
                          <Radio value="Png">Png</Radio>
                          <Radio value="Jpeg">Jpeg</Radio>
                          <Radio isDisabled value="Pdf">Pdf</Radio>
                        </RadioGroup>
                      </ModalBody>
                      <ModalFooter>
                        <ExportButton exportFunction={handleGenerate} isLoading={isPendingGeneration}
                          isDownload={exportIsAvailable} downloadURl={downloadUrl} outputFormat={outputFormat} />

                      </ModalFooter>
                    </>
                  )}
                </ModalContent>
              </Modal>

              <span className="absolute m-3 right-0">
                <Button className="shadow-medium min-w-10 rounded-full bg-white text-xl border-solid border-2 border-gray-200 p-0" onClick={() => setToolScale((current) => round(current + 0.2, 2))}>+</Button>
                <Button className="shadow-medium min-w-10 rounded-full bg-white text-xl border-solid border-2 border-gray-200 p-0" onClick={() => setToolScale((current) => round(current - 0.2, 2))}>-</Button>
                <div className="text-center">{toolScale}</div>
              </span>
            </>
            )}
            {viewState === View.View3d && <>3d view</>}
          </Card>
        </div>

        <div className="col-span-2">
          <BarrelDetailForm />
          <Divider className="my-4" />
          <form action={() => updateBarrel(loadedBarrel, barrelDetails, staveCurveConfig,
            staveCurveConfig.configDetails, staveFrontConfig, staveFrontConfig.configDetails,
            staveEndConfig, staveEndConfig.configDetails)}>
            {session.data?.user?.id === barrel.userId && <FormButton isDisabled={!enableSaveButton}>Save</FormButton>}
          </form>
          <div className="text-tiny mt-4 text-gray-500">Created : {dateString(barrel.createdAt.getTime())}</div>
          <div className="text-tiny text-gray-500">Last updated : {dateString(barrel.updatedAt.getTime())}</div>
        </div>
      </div >
    </>)
}