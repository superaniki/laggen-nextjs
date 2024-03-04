import FormInput from "@/components/common/form-input";
import { ChangeEvent } from "react";
import useBarrelStore from "@/store/barrel-store";
import FormCheckBox from "@/components/common/form-checkbutton";
import { StaveTool } from "@/common/enums";

export function StaveEndConfig() {
  const { staveEndConfig, updateToolDetails } = useBarrelStore();
  if (staveEndConfig === null)
    return <></>

  const configDetailsDataArray = staveEndConfig.configDetails;
  const configDetails = configDetailsDataArray.find(item => (item.paperType === staveEndConfig.defaultPaperType));

  if (configDetails === undefined)
    return <></>;

  function handleUpdate(event: ChangeEvent<HTMLInputElement>) {
    const { value, name } = event.target;
    const numberValue = parseFloat(value);
    updateToolDetails(StaveTool.End, name, numberValue);
  }

  function handleCheckMark(event: ChangeEvent<HTMLInputElement>) {
    const { checked, name } = event.target;
    updateToolDetails(StaveTool.End, name, checked);
  }

  return <>
    <FormCheckBox callback={handleCheckMark} name={"rotatePaper"} value={configDetails.rotatePaper} />
    <FormInput callback={handleUpdate} name={"topEndY"} value={configDetails.topEndY.toString()} type={"number"} />
    <FormInput callback={handleUpdate} name={"bottomEndY"} value={configDetails.bottomEndY.toString()} type={"number"} />
  </>
}