
import { Button, Divider } from "@nextui-org/react";
import useBarrelStore from "@/store/barrel-store";
import useEditStore from "@/store/edit-store";
import usePaperSize from "@/components/hooks/usePaperSize";
import { Paper, StaveTool, View } from "@/common/enums";

export default function StaveToolNav() {
  const { staveCurveConfig, staveFrontConfig, updatePaperState } = useBarrelStore();
  const { staveToolState, viewState, setViewState, setStaveToolState } = useEditStore();
  const paperSize = usePaperSize();

  if (staveCurveConfig === null || staveFrontConfig === null)
    return <></>
  const configDetailsDataArray = staveCurveConfig.configDetails;
  const configDetails = configDetailsDataArray.find(item => (item.paperType === staveCurveConfig.defaultPaperType));
  if (configDetails === undefined)
    return <></>;

  function StaveToolButton({ buttonType, label }: { buttonType: StaveTool, label: string }) {
    return <Button className="w-full xl:w-auto min-w-[3em] row-span-1" disableRipple color="default"
      variant={staveToolState === buttonType ? "solid" : "faded"}
      onClick={() => setStaveToolState(buttonType)}>{label}</Button>
  }

  console.log("StaveToolNav:" + staveToolState);

  return <div className={`grid gap-2 relative ${viewState !== View.Tools && "opacity-0"}`}>
    <div className={`${viewState !== View.Tools && "opacity-disabled"} flex flex-col items-center text-sm`}>templates for stave</div>
    <div className="xl:flex xl:flex-row self-center justify-center">
      <StaveToolButton buttonType={StaveTool.Curve} label="inside" />
      <StaveToolButton buttonType={StaveTool.Front} label="front" />
      <StaveToolButton buttonType={StaveTool.End} label="end" />
    </div>
    <Divider className="box-content my-4 mx-2 w-auto" />
    <div className={`${viewState !== View.Tools && "opacity-disabled"} flex flex-col items-center text-sm`}>Paper size</div>

    <div className="flex flex-row self-center justify-center">

      <Button variant={paperSize === Paper.A3 ? "solid" : "faded"} disableRipple
        onClick={() => updatePaperState(staveToolState, Paper.A3)} >A3</Button>
      <Button variant={paperSize === Paper.A4 ? "solid" : "faded"} disableRipple
        onClick={() => updatePaperState(staveToolState, Paper.A4)} >A4</Button>
    </div>

    {viewState !== View.Tools && <div className="absolute inset-0 bg-white opacity-75" ></div>}
  </div>

}