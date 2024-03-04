import FormInput from "@/components/common/form-input";
import { ChangeEvent } from "react";
import useBarrelStore from "@/store/barrel-store";
import FormCheckBox from "@/components/common/form-checkbutton";
import { StaveTool } from "@/common/enums";

export function StaveFrontConfig() {
  const { staveFrontConfig, updateToolDetails } = useBarrelStore();
  if (staveFrontConfig === null)
    return <></>

  const configDetailsDataArray = staveFrontConfig.configDetails;
  const configDetails = configDetailsDataArray.find(item => (item.paperType === staveFrontConfig.defaultPaperType));

  if (configDetails === undefined)
    return <></>;

  function handleUpdate(event: ChangeEvent<HTMLInputElement>) {
    const { value, name } = event.target;
    const numberValue = parseFloat(value);
    updateToolDetails(StaveTool.Front, name, numberValue);
  }

  function handleCheckMark(event: ChangeEvent<HTMLInputElement>) {
    const { checked, name } = event.target;
    updateToolDetails(StaveTool.Front, name, checked);
  }

  return <>
    <FormCheckBox callback={handleCheckMark} name={"rotatePaper"} value={configDetails.rotatePaper} />
    <FormInput callback={handleUpdate} name={"posX"} value={configDetails.posX.toString()} type={"number"} />
    <FormInput callback={handleUpdate} name={"posY"} value={configDetails.posY.toString()} type={"number"} />
    <FormInput step={1} min={8} callback={handleUpdate} name={"spacing"} value={configDetails.spacing.toString()} type={"number"} />
  </>
}