"use client";
import BarrelCanvas from "../canvas/barrel-canvas";
import { ChangeEvent, useEffect, useState } from "react";
import { Button, Card, Divider } from "@nextui-org/react";
import {
  applyBarrelHeight, applyBarrelTopDiameter, applyBarrelAngle,
  applyBarrelBottomDiameter, applyBarrelStaveLength
} from "../canvas/commons/barrel-math";
import { updateBarrel } from "@/actions";
import FormButton from "../common/form-button";
import FormInput from "../common/form-input";
import { useSession } from "next-auth/react";
import { BarrelWithData, StaveCurveConfigWithData } from "@/db/queries/barrels";
import FormCheckBox from "../common/form-checkbutton";
import LoadingString from "../common/loading-string";
import OnPaper from "../canvas/printouts/on-paper";
import { Paper } from "../canvas/printouts/on-paper";
import { Barrel, BarrelDetails, StaveCurveConfig, StaveCurveConfigDetails } from "@prisma/client";
import { BarrelDetailForm } from "./edit-partials/barrel-detail-form";
import { StaveCurveConfigForm } from "./edit-partials/stavecurve-config-form";
import useBarrelStore from "./store";
import MainEditNav from "./edit-partials/main-edit-nav";
import StaveToolNav from "./edit-partials/stave-tool-nav";

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

export default function BarrelEdit({ barrel }: { barrel: BarrelWithData }) {
  const { user, barrelDetails: loadedBarrelDetails, staveCurveConfig: loadedStaveCurveConfig, ...loadedBarrel } = { ...barrel };

  const [viewState, setViewState] = useState(View.Barrel);
  const [staveToolState, setStaveToolState] = useState<StaveTool>(StaveTool.Front);

  const { setBarrel, details: barrelDetails, staveCurveConfig } = useBarrelStore();
  const session = useSession();

  useEffect(() => {
    setBarrel(barrel);
  }, [setBarrel, barrel])

  if (barrel === undefined)
    return <LoadingString />;

  if (staveCurveConfig === null || barrelDetails == null)
    return <></>

  function dateString(milliSeconds: number) {
    const date = new Date(milliSeconds);
    const month = date.toLocaleString('en-us', { month: 'long' });
    return date.getDate() + ' of ' + month + ', ' + date.getFullYear();
  }

  const testEquality = (currentValue: StaveCurveConfigDetails, index: number) => {
    const test = JSON.stringify({ ...currentValue }) === JSON.stringify({ ...loadedStaveCurveConfig.configDetails[index] });
    //console.log(index + ":" + test)
    //console.log(JSON.stringify({ ...currentValue }));
    //console.log(JSON.stringify({ ...loadedStaveCurveConfig.configDetails[index] }));
    //console.log("currentvalue : ", currentValue.rotatePaper)
    //console.log("configDetails[index] : ", loadedStaveCurveConfig.configDetails[index].rotatePaper)

    return test;
  };

  //for (let i = 0)

  let enableSaveButton = false;
  if (JSON.stringify({ ...barrelDetails }) !== JSON.stringify({ ...loadedBarrelDetails }) ||
    JSON.stringify({ ...staveCurveConfig }) !== JSON.stringify({ ...loadedStaveCurveConfig }) ||
    !staveCurveConfig.configDetails.every(testEquality)) {
    enableSaveButton = true;
  }

  /*
  function changePaperState(newPaperState: string) {
    switch (staveToolState) {
      case StaveTool.Curve:
        updateStaveCurvePaper(newPaperState)
        break;
      default:
        break;
    }
  }*/

  function getCurrentPaperState() {
    switch (staveToolState) {
      case StaveTool.Curve:
        return staveCurveConfig?.defaultPaperType as Paper
      //case StaveTool.Front:
      //  return staveFrontConfig?.defaultPaperType as Paper
      /* **********  Fyll på  ******************
      case BarrelTool.StaveEnd:
      return
      
      */
      default:
        return Paper.A4;
    }
  }

  return (
    <>
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-2 grid content-start gap-2 relative">
          <MainEditNav viewState={viewState} setViewState={setViewState} />
          <Divider className="box-content my-4 mx-2 w-auto" />
          <StaveToolNav staveToolState={staveToolState} setBarrelToolState={setStaveToolState} viewState={viewState} setViewState={setViewState} />
          <Divider className="box-content my-4 mx-2 w-auto" />
          <div className="grid gap-2 relative">
            {staveToolState === StaveTool.Curve && (
              <StaveCurveConfigForm />
            )}
          </div>
        </div>

        <div className="col-span-8">
          <Card className="py-4 bg-gradient-to-t from-green-100 to-blue-100 items-center p-0">
            {viewState === View.Barrel && <BarrelCanvas barrel={barrelDetails} />}
            {viewState === View.Tools && (
              <div className="shadow-medium">
                <OnPaper tool={staveToolState} paper={getCurrentPaperState()} />
              </div>
            )}
            {viewState === View.View3d && <>3d view</>}
          </Card>
        </div>

        <div className="col-span-2">
          <BarrelDetailForm />
          <Divider className="my-4" />
          <form action={() => updateBarrel(loadedBarrel, barrelDetails, staveCurveConfig, staveCurveConfig.configDetails)}>
            {session.data?.user?.id === barrel.userId && <FormButton isDisabled={!enableSaveButton}>Save</FormButton>}
          </form>
          <div className="text-tiny mt-4 text-gray-500">Created : {dateString(barrel.createdAt.getTime())}</div>
          <div className="text-tiny text-gray-500">Last updated : {dateString(barrel.updatedAt.getTime())}</div>
        </div>
      </div >
    </>)
}