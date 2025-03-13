import { BarrelDetails } from "@prisma/client"
import { StaveTool } from "./enums"
import { StaveCurveConfigWithData, StaveEndConfigWithData, StaveFrontConfigWithData } from "@/db/queries/barrels"

export type BarrelExportData = {
  barrelDetails: BarrelDetails,
  staveToolState: StaveTool,
  staveCurveConfig: StaveCurveConfigWithData
  staveEndConfig: StaveEndConfigWithData
  staveFrontConfig: StaveFrontConfigWithData
}