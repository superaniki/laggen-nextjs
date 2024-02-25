import FormCheckBox from "@/components/common/form-checkbutton";
import FormInput from "@/components/common/form-input";
import LoadingString from "@/components/common/loading-string";
import { Divider } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { ChangeEvent } from "react";
import useBarrelStore from "@/store/barrel-store";

export function BarrelDetailForm() {
  const session = useSession();

  const { loadedBarrel: barrel, details, updateBarrelDetails, updateBarrelDetailsNumber: updateNumber } = useBarrelStore();
  if (details === null || barrel === null)
    return <></>

  const { name, notes, height, bottomDiameter, topDiameter, staveLength, angle,
    staveBottomThickness, staveTopThickness, bottomThickness, bottomMargin, isPublic, isExample } = { ...details }

  let author: string | React.ReactNode = <LoadingString />;
  if (session.status !== "loading") {
    if (session.data?.user?.id === barrel.userId)
      author = "You";
    else
      author = barrel.user?.name;
  }

  function handleNumberInput(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    const numberValue = parseFloat(value);
    updateNumber(name, numberValue);
  }

  function handleStringInput(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    updateBarrelDetails(name, value);
  }

  function handleCheckMark(event: ChangeEvent<HTMLInputElement>) {
    const { checked, name } = event.target;
    updateBarrelDetails(name, checked);
  }

  return <>
    <FormInput callback={handleStringInput} name={"name"} value={name} type={"string"} />
    <FormInput callback={handleStringInput} name={"notes"} value={notes} type={"string"} />
    <div className="text-tiny mt-4 text-gray-500">Author: {author}</div>
    <Divider className="my-4" />
    <FormInput callback={handleNumberInput} name={"height"} value={height.toString()} type={"number"} />
    <FormInput callback={handleNumberInput} name={"bottomDiameter"} value={bottomDiameter.toString()} type={"number"} />
    <FormInput callback={handleNumberInput} name={"topDiameter"} value={topDiameter.toString()} type={"number"} />
    <FormInput callback={handleNumberInput} name={"staveLength"} value={staveLength.toString()} type={"number"} />
    <FormInput step={1} callback={handleNumberInput} name={"angle"} value={angle.toString()} type={"number"} />
    <Divider className="my-4" />
    <FormInput step={1} callback={handleNumberInput} name={"staveBottomThickness"} value={staveBottomThickness.toString()} type={"number"} />
    <FormInput step={1} callback={handleNumberInput} name={"staveTopThickness"} value={staveTopThickness.toString()} type={"number"} />
    <FormInput step={1} callback={handleNumberInput} name={"bottomThickness"} value={bottomThickness.toString()} type={"number"} />
    <FormInput step={1} callback={handleNumberInput} name={"bottomMargin"} value={bottomMargin.toString()} type={"number"} />
    <Divider className="my-4" />
    <FormCheckBox callback={handleCheckMark} name={"isPublic"} value={isPublic} />
    <FormCheckBox callback={handleCheckMark} name={"isExample"} value={isExample} />
  </>
}