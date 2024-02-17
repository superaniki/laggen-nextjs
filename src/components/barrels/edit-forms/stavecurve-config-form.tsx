import FormInput from "@/components/common/form-input";
import { StaveCurveConfigWithData } from "@/db/queries/barrels";
import { ChangeEvent } from "react";


type StaveCurveConfigFormProps = {
  config: StaveCurveConfigWithData,
  handleUpdate: (event: ChangeEvent<HTMLInputElement>) => void
}

export function StaveCurveConfigForm({ config, handleUpdate }: StaveCurveConfigFormProps) {
  const configDetailsDataArray = config.configDetails;
  const configDetails = configDetailsDataArray.find(item => (item.paperType === config.defaultPaperType));

  if (configDetails === undefined)
    return <></>;

  return <>
    <FormInput callback={handleUpdate} name={"posX"} value={configDetails.posX.toString()} type={"number"} />
    <FormInput callback={handleUpdate} name={"posY"} value={configDetails.posY.toString()} type={"number"} />
  </>
}