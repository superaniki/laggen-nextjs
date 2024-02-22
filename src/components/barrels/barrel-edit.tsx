"use client";
import BarrelCanvas from "../canvas/barrel-canvas";
import { useEffect } from "react";
import { Card, Divider } from "@nextui-org/react";
import { updateBarrel } from "@/actions";
import FormButton from "../common/form-button";
import { useSession } from "next-auth/react";
import { BarrelWithData, } from "@/db/queries/barrels";
import LoadingString from "../common/loading-string";
import OnPaper from "../canvas/printouts/on-paper";
import { StaveCurveConfigDetails } from "@prisma/client";
import { BarrelDetailForm } from "./edit-partials/barrel-detail-form";
import { StaveCurveConfigForm } from "./edit-partials/stavecurve-config-form";
import useBarrelStore from "./barrel-store";
import MainEditNav from "./edit-partials/main-edit-nav";
import StaveToolNav from "./edit-partials/stave-tool-nav";
import useEditStore, { Paper, StaveTool, View } from "./edit-store";


export default function BarrelEdit({ barrel }: { barrel: BarrelWithData }) {
  const { user, barrelDetails: loadedBarrelDetails, staveCurveConfig: loadedStaveCurveConfig, ...loadedBarrel } = { ...barrel };
  const { staveToolState, viewState, paperState: paperSize } = useEditStore();
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
    return test;
  };

  let enableSaveButton = false;
  if (JSON.stringify({ ...barrelDetails }) !== JSON.stringify({ ...loadedBarrelDetails }) ||
    JSON.stringify({ ...staveCurveConfig }) !== JSON.stringify({ ...loadedStaveCurveConfig }) ||
    !staveCurveConfig.configDetails.every(testEquality)) {
    enableSaveButton = true;
  }

  console.log("barrel edit, paperSize :", paperSize)

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
              <StaveCurveConfigForm />
            )}
          </div>
        </div>

        <div className="col-span-8">
          <Card className="py-4 bg-gradient-to-t from-green-100 to-blue-100 items-center p-0">
            {viewState === View.Barrel && <BarrelCanvas barrel={barrelDetails} />}
            {viewState === View.Tools && (
              <div className="shadow-medium">
                <OnPaper tool={staveToolState} />
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