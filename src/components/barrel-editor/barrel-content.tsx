import { Card, Button, useDisclosure } from "@nextui-org/react";
import { View, StaveTool } from "@/common/enums";
import BarrelCanvas from "@/components/barrel-canvas/barrel-canvas";
import PrintoutCanvas from "@/components/printout-canvas/printout-canvas";
import ExportModal from "./export-modal";
import { ZoomControl } from "./utils/zoom-control";
import { staveToolString } from "@/common/utils";
import { BarrelExportData } from "@/common/types";

interface BarrelContentProps {
  viewState: View;
  barrelDetails: any; // Replace with proper type
  toolScale: number;
  setToolScale: (scale: number) => void;
  staveToolState: StaveTool;
  paperWidth: number;
  paperHeight: number;
  barrelExportData: BarrelExportData;
}

export function BarrelContent({
  viewState,
  barrelDetails,
  toolScale,
  setToolScale,
  staveToolState,
  paperWidth,
  paperHeight,
  barrelExportData
}: BarrelContentProps) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  return (
    <Card className="bg-gradient-to-t from-green-100 to-blue-100 items-center p-0">
      {viewState === View.Barrel && <BarrelCanvas barrel={barrelDetails} />}
      {viewState === View.Tools && (
        <>
          <div className="mt-4 shadow-medium">
            <PrintoutCanvas scale={toolScale} />
          </div>
          <Button className="my-4" onClick={onOpen}>Export</Button>
          <ExportModal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            onClose={onClose}
            staveToolState={staveToolString(staveToolState)}
            paperWidth={paperWidth}
            paperHeight={paperHeight}
            barrelExportData={barrelExportData}
          />
          <ZoomControl toolScale={toolScale} setToolScale={setToolScale} />
        </>
      )}
      {viewState === View.View3d && <>3d view</>}
    </Card>
  );
}