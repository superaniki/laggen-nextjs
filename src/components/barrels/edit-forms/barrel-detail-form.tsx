import FormCheckBox from "@/components/common/form-checkbutton";
import FormInput from "@/components/common/form-input";
import LoadingString from "@/components/common/loading-string";
import { BarrelWithData } from "@/db/queries/barrels";
import { Divider } from "@nextui-org/react";
import { BarrelDetails } from "@prisma/client";
import { useSession } from "next-auth/react";
import { ChangeEvent } from "react";


type BarrelDetailFormProps = {
  barrel: BarrelWithData
  barrelDetails: BarrelDetails;
  updateString: (event: ChangeEvent<HTMLInputElement>) => void;
  updateNumber: (event: ChangeEvent<HTMLInputElement>) => void;
  updateCheckmark: (event: ChangeEvent<HTMLInputElement>) => void;
}


export function BarrelDetailForm({ barrel, barrelDetails, updateString, updateNumber, updateCheckmark }: BarrelDetailFormProps) {
  const { name, notes, height, bottomDiameter, topDiameter, staveLength, angle,
    staveBottomThickness, staveTopThickness, bottomThickness, bottomMargin, isPublic, isExample } = { ...barrelDetails }

  const session = useSession();

  let author: string | React.ReactNode = <LoadingString />;
  if (session.status !== "loading") {
    if (session.data?.user?.id === barrel.userId)
      author = "You";
    else
      author = barrel.user?.name;
  }

  return <>
    <FormInput callback={updateString} name={"name"} value={name} type={"string"} />
    <FormInput callback={updateString} name={"notes"} value={notes} type={"string"} />
    <div className="text-tiny mt-4 text-gray-500">Author: {author}</div>
    <Divider className="my-4" />
    <FormInput callback={updateNumber} name={"height"} value={height.toString()} type={"number"} />
    <FormInput callback={updateNumber} name={"bottomDiameter"} value={bottomDiameter.toString()} type={"number"} />
    <FormInput callback={updateNumber} name={"topDiameter"} value={topDiameter.toString()} type={"number"} />
    <FormInput callback={updateNumber} name={"staveLength"} value={staveLength.toString()} type={"number"} />
    <FormInput callback={updateNumber} name={"angle"} value={angle.toString()} type={"number"} />
    <Divider className="my-4" />
    <FormInput callback={updateNumber} name={"staveBottomThickness"} value={staveBottomThickness.toString()} type={"number"} />
    <FormInput callback={updateNumber} name={"staveTopThickness"} value={staveTopThickness.toString()} type={"number"} />
    <FormInput callback={updateNumber} name={"bottomThickness"} value={bottomThickness.toString()} type={"number"} />
    <FormInput callback={updateNumber} name={"bottomMargin"} value={bottomMargin.toString()} type={"number"} />
    <Divider className="my-4" />
    <FormCheckBox callback={updateCheckmark} name={"isPublic"} value={isPublic} />
    <FormCheckBox callback={updateCheckmark} name={"isExample"} value={isExample} />
  </>
}