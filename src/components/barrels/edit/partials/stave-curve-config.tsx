import FormInput from "@/ui/form-input";
import { ChangeEvent } from "react";
import useBarrelStore from "@/store/barrel-store";
import FormCheckBox from "@/ui/form-checkbutton";
import { StaveTool } from "@/common/enums";

export function StaveCurveConfig() {

  const { staveCurveConfig: config, updateToolDetails } = useBarrelStore();
  if (config === null)
    return <></>

  const configDetailsDataArray = config.configDetails;
  const configDetails = configDetailsDataArray.find(item => (item.paperType === config.defaultPaperType));

  if (configDetails === undefined)
    return <></>;

  function handleUpdate(event: ChangeEvent<HTMLInputElement>) {
    const { value, name } = event.target;
    const numberValue = parseFloat(value);
    updateToolDetails(StaveTool.Curve, name, numberValue);
  }

  function handleCheckMark(event: ChangeEvent<HTMLInputElement>) {
    const { checked, name } = event.target;
    updateToolDetails(StaveTool.Curve, name, checked);
  }

  return <>
    <FormCheckBox callback={handleCheckMark} name={"rotatePaper"} value={configDetails.rotatePaper} />
    <FormInput callback={handleUpdate} name={"posX"} value={configDetails.posX.toString()} type={"number"} />
    <FormInput callback={handleUpdate} name={"posY"} value={configDetails.posY.toString()} type={"number"} />
    <FormInput callback={handleUpdate} name={"innerTopY"} value={configDetails.innerTopY.toString()} type={"number"} />
    <FormInput callback={handleUpdate} name={"outerTopY"} value={configDetails.outerTopY.toString()} type={"number"} />
    <FormInput callback={handleUpdate} name={"innerBottomY"} value={configDetails.innerBottomY.toString()} type={"number"} />
    <FormInput callback={handleUpdate} name={"outerBottomY"} value={configDetails.outerBottomY.toString()} type={"number"} />
    <FormInput callback={handleUpdate} name={"rectHeight"} value={configDetails.rectHeight.toString()} type={"number"} />
    <FormInput callback={handleUpdate} name={"rectWidth"} value={configDetails.rectWidth.toString()} type={"number"} />

  </>
}