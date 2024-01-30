"use client";
import { Barrel } from "@prisma/client";
import BarrelCanvas from "../canvas/barrel-canvas";
import Head from "next/head";
import { ChangeEvent, useState } from "react";
import { Button, Card, CardBody, Checkbox, Divider } from "@nextui-org/react";
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
import { PrintoutsCanvas } from "../canvas/printouts-canvas";
import LoadingString from "../common/loading-string";


enum ViewState {
  Barrel,
  Printouts,
  View3d
}

export default function BarrelEdit({ barrelWithUser }: { barrelWithUser: BarrelWithUser }) {
  const { user, ...barrel } = { ...barrelWithUser };
  const [viewToggleState, setViewToggleState] = useState(ViewState.Barrel);
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

  return (
    <>
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-1 grid content-start gap-2">
          <Button color="default" variant={viewToggleState === ViewState.Barrel ? "solid" : "faded"} className="row-span-1" onClick={() => setViewToggleState(ViewState.Barrel)}>Barrel</Button>
          <Button color="default" variant={viewToggleState === ViewState.Printouts ? "solid" : "faded"} className="row-span-1" onClick={() => setViewToggleState(ViewState.Printouts)}>Printouts</Button>
          <Button color="default" variant={viewToggleState === ViewState.View3d ? "solid" : "faded"} className="row-span-1" onClick={() => setViewToggleState(ViewState.View3d)}>View </Button>
        </div>

        <div className="col-span-9">
          <Card className="py-4 bg-gradient-to-t from-green-100 to-blue-100 ">
            <CardBody className="">
              {viewToggleState === ViewState.Barrel && <BarrelCanvas barrel={editedBarrel} />}
              {viewToggleState === ViewState.Printouts && <PrintoutsCanvas barrel={editedBarrel} />}
              {viewToggleState === ViewState.View3d && <PrintoutsCanvas barrel={editedBarrel} />}
            </CardBody>
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