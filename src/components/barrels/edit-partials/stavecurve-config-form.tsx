import FormInput from "@/components/common/form-input";
import { StaveCurveConfigWithData } from "@/db/queries/barrels";
import { ChangeEvent } from "react";
import useStore from "../barrel-store";
import useBarrelStore from "../barrel-store";


export function StaveCurveConfigForm() {

  const { staveCurveConfig: config, updateStaveCurve } = useBarrelStore();
  if (config === null)
    return <></>

  const configDetailsDataArray = config.configDetails;
  const configDetails = configDetailsDataArray.find(item => (item.paperType === config.defaultPaperType));

  if (configDetails === undefined)
    return <></>;

  function handleUpdate(event: ChangeEvent<HTMLInputElement>) {
    const { value, name } = event.target;
    const numberValue = parseFloat(value);

    updateStaveCurve(name, numberValue);
  }

  return <>
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