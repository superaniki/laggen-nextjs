"use client";
import { Barrel } from "@prisma/client";
import BarrelCanvas from "../canvas/barrel-canvas";
import { ChangeEvent, useState } from "react";
import { Button, Card, CardBody, Divider } from "@nextui-org/react";
import {
  applyBarrelHeight, applyBarrelTopDiameter, applyBarrelAngle,
  applyBarrelBottomDiameter, applyBarrelStaveLength
} from "../canvas/commons/barrel-math";
import { updateBarrel } from "@/actions";
import FormButton from "../common/form-button";
import FormInput from "../common/form-input";
import { useSession } from "next-auth/react";
import { BarrelWithUser } from "@/db/queries/barrels";
import FormCheckBox from "../common/form-checkbutton";
import { PrintoutsCanvas } from "../canvas/printouts/printouts-canvas";
import LoadingString from "../common/loading-string";
import OnPaper, { BarrelTool } from "../canvas/printouts/on-paper";

enum View {
  Barrel,
  Tools,
  View3d
}

enum StaveToolView {
  Inside,
  Front,
  End
}

export default function BarrelEdit({ barrelWithUser }: { barrelWithUser: BarrelWithUser }) {
  const { user, ...barrel } = { ...barrelWithUser };
  const [viewState, setViewState] = useState(View.Barrel);
  const [staveToolViewState, setStaveToolViewState] = useState(StaveToolView.Inside);

  const [editedBarrel, setEditedBarrel] = useState<Barrel>(barrel);
  const session = useSession();

  if (barrelWithUser === undefined)
    return <LoadingString />;

  let author: string | React.ReactNode = <LoadingString />;
  if (session.status !== "loading") {
    if (session.data?.user?.id === barrel.userId)
      author = "You";
    else
      author = user?.name;
  }

  function updateNumber(event: ChangeEvent<HTMLInputElement>) {
    const { value, name } = event.target;

    const numberValue = parseFloat(value);
    switch (name.toLowerCase()) {
      case "height":
        setEditedBarrel((prevBarrel): Barrel => ({ ...applyBarrelHeight(numberValue, prevBarrel) }));
        break;
      case "topdiameter":
        setEditedBarrel((prevBarrel): Barrel => ({ ...applyBarrelTopDiameter(numberValue, prevBarrel) }));
        break;
      case "angle":
        setEditedBarrel((prevBarrel): Barrel => ({ ...applyBarrelAngle(numberValue, prevBarrel) }));
        break;
      case "bottomdiameter":
        setEditedBarrel((prevBarrel): Barrel => ({ ...applyBarrelBottomDiameter(numberValue, prevBarrel) }));
        break;
      case "stavelength":
        setEditedBarrel((prevBarrel): Barrel => ({ ...applyBarrelStaveLength(numberValue, prevBarrel) }));
        break;
      default:
        setEditedBarrel((prevBarrel): Barrel => ({ ...prevBarrel, [name]: numberValue }));
    }
  }

  function updateString(event: ChangeEvent<HTMLInputElement>) {
    const { value, name } = event.target;
    setEditedBarrel((prevBarrel): Barrel => ({ ...prevBarrel, [name]: value }));
  }

  function updateCheckmark(event: ChangeEvent<HTMLInputElement>) {
    const { checked, name } = event.target;
    console.log("checked: " + name + " " + checked);
    setEditedBarrel((prevBarrel): Barrel => ({ ...prevBarrel, [name]: checked }));
  }

  function dateString(milliSeconds: number) {
    const date = new Date(milliSeconds);
    const month = date.toLocaleString('en-us', { month: 'long' });
    return date.getDate() + ' of ' + month + ', ' + date.getFullYear();
  }

  let enableSaveButton = false;
  if (JSON.stringify({ ...barrel, updatedAt: '' }) !== JSON.stringify({ ...editedBarrel, updatedAt: '' })) {
    enableSaveButton = true;
  }


  function ViewButton({ buttonType, label }: { buttonType: View, label: string }) {
    return <Button disableRipple color="default" variant={viewState === buttonType ? "solid" : "faded"} className="row-span-1" onClick={() => setViewState(buttonType)}>{label}</Button>
  }

  function StaveToolButton({ buttonType, label }: { buttonType: StaveToolView, label: string }) {
    return <Button className="w-full xl:w-auto min-w-[3em] row-span-1" isDisabled={viewState !== View.Tools} disableRipple color="default" variant={staveToolViewState === buttonType ? "solid" : "faded"} onClick={() => setStaveToolViewState(buttonType)}>{label}</Button>
  }

  return (
    <>
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-2 grid content-start gap-2">
          <ViewButton buttonType={View.Barrel} label="Barrel" />
          <ViewButton buttonType={View.View3d} label="3dView" />
          <ViewButton buttonType={View.Tools} label="Tools" />

          <Divider className="box-content my-4 mx-2 w-auto" />

          <div className={`${viewState !== View.Tools && "opacity-disabled"} flex flex-col items-center text-sm`}>templates for stave</div>
          <div className="xl:flex xl:flex-row self-center justify-center">
            <StaveToolButton buttonType={StaveToolView.Inside} label="inside" />
            <StaveToolButton buttonType={StaveToolView.Front} label="front" />
            <StaveToolButton buttonType={StaveToolView.End} label="end" />
          </div>

          <Divider className="box-content my-4 mx-2 w-auto" />
        </div>

        <div className="col-span-8">
          <Card className="py-4 bg-gradient-to-t from-green-100 to-blue-100 items-center p-0">
            {viewState === View.Barrel && <BarrelCanvas barrel={editedBarrel} />}
            {viewState === View.Tools && (
              <>
                {
                  staveToolViewState === StaveToolView.Inside &&
                  <div className="shadow-medium"><OnPaper barrel={editedBarrel} tool={BarrelTool.PlaningTool} /></div>
                }
                {
                  staveToolViewState === StaveToolView.Front &&
                  <div className="shadow-medium"><OnPaper barrel={editedBarrel} tool={BarrelTool.StaveFront} /></div>
                }
                {
                  staveToolViewState === StaveToolView.End &&
                  <div className="shadow-medium"><OnPaper barrel={editedBarrel} tool={BarrelTool.StaveEnds} /></div>}
              </>
            )}
            {viewState === View.View3d && <>3d view</>}
          </Card>
        </div>
        <div className="col-span-2">
          <form action={() => updateBarrel(editedBarrel.id, editedBarrel)}>
            <FormInput callback={updateString} name={"name"} value={editedBarrel.name} type={"string"} />
            <FormInput callback={updateString} name={"notes"} value={editedBarrel.notes} type={"string"} />
            <div className="text-tiny mt-4 text-gray-500">Author: {author}</div>
            <Divider className="my-4" />
            <FormInput callback={updateNumber} name={"height"} value={editedBarrel.height.toString()} type={"number"} />
            <FormInput callback={updateNumber} name={"bottomDiameter"} value={editedBarrel.bottomDiameter.toString()} type={"number"} />
            <FormInput callback={updateNumber} name={"topDiameter"} value={editedBarrel.topDiameter.toString()} type={"number"} />
            <FormInput callback={updateNumber} name={"staveLength"} value={editedBarrel.staveLength.toString()} type={"number"} />
            <FormInput callback={updateNumber} name={"angle"} value={editedBarrel.angle.toString()} type={"number"} />
            <Divider className="my-4" />
            <FormInput callback={updateNumber} name={"staveBottomThickness"} value={editedBarrel.staveBottomThickness.toString()} type={"number"} />
            <FormInput callback={updateNumber} name={"staveTopThickness"} value={editedBarrel.staveTopThickness.toString()} type={"number"} />
            <FormInput callback={updateNumber} name={"bottomThickness"} value={editedBarrel.bottomThickness.toString()} type={"number"} />
            <FormInput callback={updateNumber} name={"bottomMargin"} value={editedBarrel.bottomMargin.toString()} type={"number"} />
            <Divider className="my-4" />
            <FormCheckBox callback={updateCheckmark} name={"isPublic"} value={editedBarrel.isPublic} />
            <FormCheckBox callback={updateCheckmark} name={"isExample"} value={editedBarrel.isExample} />
            <Divider className="my-4" />
            {session.data?.user?.id === barrel.userId && <FormButton isDisabled={!enableSaveButton}>Save</FormButton>}
            <div className="text-tiny mt-4 text-gray-500">Created : {dateString(editedBarrel.createdAt.getTime())}</div>
            <div className="text-tiny text-gray-500">Last updated : {dateString(editedBarrel.updatedAt.getTime())}</div>
          </form>
        </div>
      </div >
    </>)
}