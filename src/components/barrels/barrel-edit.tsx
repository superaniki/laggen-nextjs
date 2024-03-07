"use client";
import BarrelCanvas from "../canvas/barrel-canvas";
import { useEffect, useState } from "react";
import { Button, Card, Divider } from "@nextui-org/react";
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

export default function BarrelEdit({ barrel }: { barrel: BarrelWithData }) {
  const { user, barrelDetails: loadedBarrelDetails, staveEndConfig: loadedStaveEndConfig, staveFrontConfig: loadedStaveFrontConfig, staveCurveConfig: loadedStaveCurveConfig, ...loadedBarrel } = { ...barrel };
  const { staveToolState, viewState } = useEditStore();
  const { setBarrel, details: barrelDetails, staveCurveConfig, staveFrontConfig, staveEndConfig } = useBarrelStore();
  const session = useSession();
  const [toolScale, setToolScale] = useState(2.4);

  useEffect(() => {
    setBarrel(barrel);
  }, [setBarrel, barrel])

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


  async function savePng() {
    try {
      const jsonData = { staveToolState, staveCurveConfig, staveEndConfig, staveFrontConfig, barrelDetails }; // Your JSON data object
      const response = await fetch('/api/barrels/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonData),
      });

      const imageBuffer = await response.arrayBuffer();
      const dataUrl = `data:image/png;base64,${Buffer.from(imageBuffer).toString('base64')}`;
      // Prompt user to save the image to disk
      const anchor = document.createElement('a');
      anchor.href = dataUrl;
      anchor.download = 'toolthing.png';
      anchor.click();
    } catch (error) {
      console.error('Error fetching image:', error);
    }
  };

  return (
    <>
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-2 grid content-start gap-2 relative">
          <MainEditNav />
          <Divider className="box-content my-4 mx-2 w-auto" />
          <StaveToolNav />
          <Divider className="box-content my-4 mx-2 w-auto" />
          <div className="grid gap-2 relative">
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
              <Button className="my-4" onClick={() => savePng()}>Save PNG</Button>
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