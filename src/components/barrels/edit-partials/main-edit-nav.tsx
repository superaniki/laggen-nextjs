
import { Button, Card, Divider } from "@nextui-org/react";
import { Dispatch, SetStateAction } from "react";
import useEditStore, { View } from "@/store/edit-store";
/*
type MainEditNavProps = {
  viewState: View,
  setViewState: Dispatch<SetStateAction<View>>
}*/

export default function MainEditNav() {//}: MainEditNavProps) {
  const { viewState, setViewState } = useEditStore();

  function ViewButton({ buttonType, label }: { buttonType: View, label: string }) {
    return <Button disableRipple color="default" variant={viewState === buttonType ? "solid" : "faded"} className="row-span-1" onClick={() => setViewState(buttonType)}>{label}</Button>
  }

  return <>
    <ViewButton buttonType={View.Barrel} label="Barrel" />
    <ViewButton buttonType={View.View3d} label="3dView" />
    <ViewButton buttonType={View.Tools} label="Tools" />
  </>

}