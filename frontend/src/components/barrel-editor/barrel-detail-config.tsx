import FormCheckBox from "@/ui/form-checkbutton";
import FormInput from "@/ui/form-input";
import NumberSlider from "@/ui/number-slider";
import LoadingString from "@/ui/loading-string";
import { Divider } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { ChangeEvent } from "react";
import useBarrelStore from "@/store/barrel-store";

export function BarrelDetailConfig() {
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

  function handleBlenderNumberInput(name: string, value: number) {
    updateNumber(name, value);
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
    <NumberSlider onChange={handleBlenderNumberInput} name={"height"} value={height} step={5} min={0}/>
    <NumberSlider onChange={handleBlenderNumberInput} name={"bottomDiameter"} value={bottomDiameter} step={5} />
    <NumberSlider onChange={handleBlenderNumberInput} name={"topDiameter"} value={topDiameter} step={5} />
    <NumberSlider onChange={handleBlenderNumberInput} name={"staveLength"} value={staveLength} step={5} />
    <NumberSlider onChange={handleBlenderNumberInput} name={"angle"} value={angle} step={1} min={0} max={90} />
    <Divider className="my-4" />
    <NumberSlider onChange={handleBlenderNumberInput} name={"staveBottomThickness"} value={staveBottomThickness} step={1} min={0} />
    <NumberSlider onChange={handleBlenderNumberInput} name={"staveTopThickness"} value={staveTopThickness} step={1} min={0} />
    <NumberSlider onChange={handleBlenderNumberInput} name={"bottomThickness"} value={bottomThickness} step={1} min={0} />
    <NumberSlider onChange={handleBlenderNumberInput} name={"bottomMargin"} value={bottomMargin} step={1} min={0} />
    <Divider className="my-4" />
    <FormCheckBox callback={handleCheckMark} name={"isPublic"} value={isPublic} />
    <FormCheckBox callback={handleCheckMark} name={"isExample"} value={isExample} />
  </>
}