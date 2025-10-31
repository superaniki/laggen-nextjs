import FormInput from "@/ui/form-input";
import NumberSlider from "@/ui/number-slider";
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

  function handleBlenderUpdate(name: string, value: number) {
    updateToolDetails(StaveTool.Curve, name, value);
  }

  function handleCheckMark(event: ChangeEvent<HTMLInputElement>) {
    const { checked, name } = event.target;
    updateToolDetails(StaveTool.Curve, name, checked);
  }

  return <>
    <FormCheckBox callback={handleCheckMark} name={"rotatePaper"} value={configDetails.rotatePaper} />
    <NumberSlider onChange={handleBlenderUpdate} name={"posX"} value={configDetails.posX} step={5} />
    <NumberSlider onChange={handleBlenderUpdate} name={"posY"} value={configDetails.posY} step={5} />
    <NumberSlider onChange={handleBlenderUpdate} name={"innerTopY"} value={configDetails.innerTopY} step={2} />
    <NumberSlider onChange={handleBlenderUpdate} name={"outerTopY"} value={configDetails.outerTopY} step={2} />
    <NumberSlider onChange={handleBlenderUpdate} name={"innerBottomY"} value={configDetails.innerBottomY} step={2} />
    <NumberSlider onChange={handleBlenderUpdate} name={"outerBottomY"} value={configDetails.outerBottomY} step={2} />
    <NumberSlider onChange={handleBlenderUpdate} name={"rectHeight"} value={configDetails.rectHeight} step={5} />
    <NumberSlider onChange={handleBlenderUpdate} name={"rectWidth"} value={configDetails.rectWidth} step={5} />
  </>
}