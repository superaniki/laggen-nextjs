"use client";
import BarrelCanvas from "../canvas/barrel-canvas";
import { ChangeEvent, useState } from "react";
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
import OnPaper, { BarrelTool } from "../canvas/printouts/on-paper";
import { Paper } from "../canvas/printouts/on-paper";
import { Barrel, BarrelDetails, StaveCurveConfig } from "@prisma/client";
import { BarrelDetailForm } from "./edit-forms/barrel-detail-form";
import { StaveCurveConfigForm } from "./edit-forms/stavecurve-config-form";

enum View {
  Barrel,
  Tools,
  View3d
}

export default function BarrelEdit({ barrel }: { barrel: BarrelWithData }) {
  const { user, barrelDetails, staveCurveConfig, ...onlyBarrel } = { ...barrel };
  const { configDetails, ...onlyStaveCurveConfig } = { ...staveCurveConfig }

  const [editedBarrelDetails, setEditedBarrelDetails] = useState<BarrelDetails>(barrelDetails);
  const [editedStaveCurveConfig, setEditedStaveCurveConfig] = useState<StaveCurveConfigWithData>(staveCurveConfig);

  const [viewState, setViewState] = useState(View.Barrel);
  const [barrelToolState, setbarrelToolState] = useState<BarrelTool>(BarrelTool.StaveFront);

  // FIXA! blir fel med byta av A3 / A4
  function getCurrentPaperState() {
    switch (barrelToolState) {
      case BarrelTool.StaveCurve:
        return editedStaveCurveConfig.defaultPaperType
      /* **********  Fyll på  ******************
      case BarrelTool.StaveEnd:
      return
      case BarrelTool.StaveFront:
      return 
      */
      default:
        return ""
    }
  }
  const paperState = getCurrentPaperState();
  const session = useSession();

  if (barrel === undefined)
    return <LoadingString />;

  function updateNumber(event: ChangeEvent<HTMLInputElement>) {
    const { value, name } = event.target;

    const numberValue = parseFloat(value);
    switch (name.toLowerCase()) {
      case "height":
        setEditedBarrelDetails((prevBarrel): BarrelDetails => ({ ...applyBarrelHeight(numberValue, prevBarrel) }));
        break;
      case "topdiameter":
        setEditedBarrelDetails((prevBarrel): BarrelDetails => ({ ...applyBarrelTopDiameter(numberValue, prevBarrel) }));
        break;
      case "angle":
        setEditedBarrelDetails((prevBarrel): BarrelDetails => ({ ...applyBarrelAngle(numberValue, prevBarrel) }));
        break;
      case "bottomdiameter":
        setEditedBarrelDetails((prevBarrel): BarrelDetails => ({ ...applyBarrelBottomDiameter(numberValue, prevBarrel) }));
        break;
      case "stavelength":
        setEditedBarrelDetails((prevBarrel): BarrelDetails => ({ ...applyBarrelStaveLength(numberValue, prevBarrel) }));
        break;
      default:
        setEditedBarrelDetails((prevBarrel): BarrelDetails => ({ ...prevBarrel, [name]: numberValue }));
    }
  }

  function updateString(event: ChangeEvent<HTMLInputElement>) {
    const { value, name } = event.target;
    setEditedBarrelDetails((prevBarrel): BarrelDetails => ({ ...prevBarrel, [name]: value }));
  }

  function updateCheckmark(event: ChangeEvent<HTMLInputElement>) {
    const { checked, name } = event.target;
    setEditedBarrelDetails((prevBarrel): BarrelDetails => ({ ...prevBarrel, [name]: checked }));
  }

  function dateString(milliSeconds: number) {
    const date = new Date(milliSeconds);
    const month = date.toLocaleString('en-us', { month: 'long' });
    return date.getDate() + ' of ' + month + ', ' + date.getFullYear();
  }

  let enableSaveButton = false;
  if (JSON.stringify({ ...barrel, updatedAt: '' }) !== JSON.stringify({ ...onlyBarrel, updatedAt: '' })) {
    enableSaveButton = true;
  }

  function ViewButton({ buttonType, label }: { buttonType: View, label: string }) {
    return <Button disableRipple color="default" variant={viewState === buttonType ? "solid" : "faded"} className="row-span-1" onClick={() => setViewState(buttonType)}>{label}</Button>
  }

  function StaveToolButton({ buttonType, label }: { buttonType: BarrelTool, label: string }) {
    return <Button className="w-full xl:w-auto min-w-[3em] row-span-1" disableRipple color="default"
      variant={barrelToolState === buttonType ? "solid" : "faded"}
      onClick={() => setbarrelToolState(buttonType)}>{label}</Button>
  }

  //const sessionUserId = session.data?.user?.id ? session.data?.user?.id : "loggedOut";


  function getStaveCurveConfigDetails() {
    const configDetailsDataArray = editedStaveCurveConfig.configDetails;
    return configDetailsDataArray.find(item => (item.paperType === paperState));
  }

  function getStaveCurveConfigDetailsIndex() {
    const configDetailsDataArray = editedStaveCurveConfig.configDetails;
    return configDetailsDataArray.findIndex(item => (item.paperType === paperState));
  }

  function handleStaveCurveUpdate(event: ChangeEvent<HTMLInputElement>) {
    const { value, name } = event.target;
    const numberValue = parseFloat(value);

    //if (barrelToolState === BarrelTool.StaveCurve) {

    const configDetails = getStaveCurveConfigDetails();
    if (configDetails === undefined)
      return;

    //klyddigt och komplext att uppdatera en array i en json.
    const index = getStaveCurveConfigDetailsIndex();
    const updatedConfigDetails = { ...configDetails, [name]: numberValue };
    let configDetailsArray = editedStaveCurveConfig.configDetails;
    configDetailsArray[index] = { ...updatedConfigDetails }
    const updatedConfig = { ...editedStaveCurveConfig, configDetails: configDetailsArray }
    setEditedStaveCurveConfig(updatedConfig);
  }


  function changePaperState(newPaperState: string) {
    console.log()
    switch (barrelToolState) {
      case BarrelTool.StaveCurve:
        const updatedConfig = { ...editedStaveCurveConfig, defaultPaperType: newPaperState }
        console.log("updatedConfig:" + JSON.stringify(updatedConfig));
        setEditedStaveCurveConfig(updatedConfig);
        //return editedBarrel.staveCurveConfig.defaultPaperType;
        break;
      default:
        break;
    }
  }

  return (
    <>
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-2 grid content-start gap-2 relative">
          <ViewButton buttonType={View.Barrel} label="Barrel" />
          <ViewButton buttonType={View.View3d} label="3dView" />
          <ViewButton buttonType={View.Tools} label="Tools" />

          <Divider className="box-content my-4 mx-2 w-auto" />

          <div className="grid gap-2 relative">
            <div className={`${viewState !== View.Tools && "opacity-disabled"} flex flex-col items-center text-sm`}>templates for stave</div>
            <div className="xl:flex xl:flex-row self-center justify-center">
              <StaveToolButton buttonType={BarrelTool.StaveCurve} label="inside" />
              <StaveToolButton buttonType={BarrelTool.StaveFront} label="front" />
              <StaveToolButton buttonType={BarrelTool.StaveEnd} label="end" />
            </div>
            <div className="flex flex-row self-center justify-center">
              <Button variant={paperState === Paper.A3 ? "solid" : "faded"} disableRipple
                onClick={() => changePaperState(Paper.A3)} >A3</Button>
              <Button variant={paperState === Paper.A4 ? "solid" : "faded"} disableRipple
                onClick={() => changePaperState(Paper.A4)} >A4</Button>
            </div>
            {viewState !== View.Tools && <div className="absolute inset-0 bg-white opacity-50" onClick={() => setViewState(View.Tools)}></div>}
          </div>

          <Divider className="box-content my-4 mx-2 w-auto" />
          <div className="grid gap-2 relative">
            {barrelToolState === BarrelTool.StaveCurve && (
              <StaveCurveConfigForm config={editedStaveCurveConfig} handleUpdate={handleStaveCurveUpdate} />
            )}
          </div>
        </div>

        <div className="col-span-8">
          <Card className="py-4 bg-gradient-to-t from-green-100 to-blue-100 items-center p-0">
            {viewState === View.Barrel && <BarrelCanvas barrel={editedBarrelDetails} />}
            {viewState === View.Tools && (
              <div className="shadow-medium">
                <OnPaper barrelDetails={editedBarrelDetails} staveCurveConfig={editedStaveCurveConfig} tool={barrelToolState} paper={paperState} />
              </div>
            )}
            {viewState === View.View3d && <>3d view</>}
          </Card>
        </div>

        <div className="col-span-2">
          <BarrelDetailForm barrel={barrel} barrelDetails={editedBarrelDetails} updateNumber={updateNumber}
            updateString={updateString} updateCheckmark={updateCheckmark} />
          <Divider className="my-4" />
          <form action={() => updateBarrel(onlyBarrel, editedBarrelDetails, editedStaveCurveConfig, editedStaveCurveConfig.configDetails)}>
            {session.data?.user?.id === barrel.userId && <FormButton isDisabled={!enableSaveButton}>Save</FormButton>}
          </form>

          <div className="text-tiny mt-4 text-gray-500">Created : {dateString(barrel.createdAt.getTime())}</div>
          <div className="text-tiny text-gray-500">Last updated : {dateString(barrel.updatedAt.getTime())}</div>
        </div>
      </div >
    </>)
}