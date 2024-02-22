
import { Button, Card, Divider } from "@nextui-org/react";
import { ChangeEvent, Dispatch, SetStateAction } from "react";
import useBarrelStore from "../barrel-store";
import FormCheckBox from "@/components/common/form-checkbutton";
import useEditStore, { Paper, StaveTool, View } from "../edit-store";

/*
type StaveToolNavProps = {
  staveToolState: StaveTool,
  setBarrelToolState: Dispatch<SetStateAction<StaveTool>>
  viewState: View,
  setViewState: Dispatch<SetStateAction<View>>
}
*/

export default function StaveToolNav() {
  const { staveCurveConfig, updateStaveCurvePaper, updateStaveCurve } = useBarrelStore();
  const { staveToolState, viewState, setViewState, setStaveToolState, paperState } = useEditStore();

  if (staveCurveConfig === null)
    return <></>
  const configDetailsDataArray = staveCurveConfig.configDetails;
  const configDetails = configDetailsDataArray.find(item => (item.paperType === staveCurveConfig.defaultPaperType));
  if (configDetails === undefined)
    return <></>;

  function getCurrentPaperState() {
    switch (staveToolState) {
      case StaveTool.Curve:
        if (staveCurveConfig === null)
          return "";
        return staveCurveConfig.defaultPaperType
      /*case BarrelTool.StaveEnd:
      return
      case BarrelTool.StaveFront:
      return 
      */
      default:
        return ""
    }
  }

  function changePaperState(newPaperState: string) {
    switch (staveToolState) {
      case StaveTool.Curve:
        updateStaveCurvePaper(newPaperState)
        console.log("updateStaveCurvePaper:" + newPaperState)
        break;
      default:
        break;
    }
  }

  function StaveToolButton({ buttonType, label }: { buttonType: StaveTool, label: string }) {
    return <Button className="w-full xl:w-auto min-w-[3em] row-span-1" disableRipple color="default"
      variant={staveToolState === buttonType ? "solid" : "faded"}
      onClick={() => setStaveToolState(buttonType)}>{label}</Button>
  }

  function handleCheckMark(event: ChangeEvent<HTMLInputElement>) {
    const { checked, name } = event.target;
    updateStaveCurve(name, checked);
  }

  return <div className="grid gap-2 relative">
    <div className={`${viewState !== View.Tools && "opacity-disabled"} flex flex-col items-center text-sm`}>templates for stave</div>
    <div className="xl:flex xl:flex-row self-center justify-center">
      <StaveToolButton buttonType={StaveTool.Curve} label="inside" />
      <StaveToolButton buttonType={StaveTool.Front} label="front" />
      <StaveToolButton buttonType={StaveTool.End} label="end" />
    </div>
    <Divider className="box-content my-4 mx-2 w-auto" />
    <div className="flex flex-row self-center justify-center">
      <Button variant={paperState === Paper.A3 ? "solid" : "faded"} disableRipple
        onClick={() => changePaperState(Paper.A3)} >A3</Button>
      <Button variant={paperState === Paper.A4 ? "solid" : "faded"} disableRipple
        onClick={() => changePaperState(Paper.A4)} >A4</Button>
    </div>
    <FormCheckBox callback={handleCheckMark} name={"rotatePaper"} value={configDetails.rotatePaper} />

    {viewState !== View.Tools && <div className="absolute inset-0 bg-white opacity-50" onClick={() => setViewState(View.Tools)}></div>}
  </div>

}