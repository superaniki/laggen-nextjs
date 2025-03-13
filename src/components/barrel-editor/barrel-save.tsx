import { useSession } from "next-auth/react";
import { updateBarrel } from "@/actions";
import FormButton from "@/ui/form-button";
import { dateString } from "@/common/utils";
import { BarrelWithData } from "@/db/queries/barrels";

interface BarrelSaveProps {
  barrel: BarrelWithData;
  barrelDetails: any; // Replace with proper type
  staveCurveConfig: any; // Replace with proper type
  staveFrontConfig: any; // Replace with proper type
  staveEndConfig: any; // Replace with proper type
  isSaveButtonEnabled: boolean;
}

export function BarrelSave({ 
  barrel, 
  barrelDetails, 
  staveCurveConfig, 
  staveFrontConfig, 
  staveEndConfig,
  isSaveButtonEnabled 
}: BarrelSaveProps) {
  const session = useSession();

  return (
    <>
      <form action={() => updateBarrel(
        barrel,
        barrelDetails,
        staveCurveConfig,
        staveCurveConfig.configDetails,
        staveFrontConfig,
        staveFrontConfig.configDetails,
        staveEndConfig,
        staveEndConfig.configDetails
      )}>
        {session.data?.user?.id === barrel.userId && 
          <FormButton isDisabled={!isSaveButtonEnabled}>Save</FormButton>
        }
      </form>
      <div className="text-tiny mt-4 text-gray-500">
        Created : {dateString(barrel.createdAt.getTime())}
      </div>
      <div className="text-tiny text-gray-500">
        Last updated : {dateString(barrel.updatedAt.getTime())}
      </div>
    </>
  );
}