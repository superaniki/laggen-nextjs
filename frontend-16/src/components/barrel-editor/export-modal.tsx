import React, { useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, RadioGroup, Radio } from '@nextui-org/react';
import FormInput from '@/ui/form-input';
import ExportButton from '@/ui/export-button';
import { pixelsFromCm } from '@/common/utils';
import { exportTemplateImage } from './utils/export-utils';
import { BarrelExportData } from '@/common/types';

interface ExportModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
  staveToolState: string;
  paperWidth: number;
  paperHeight: number;
  barrelExportData: BarrelExportData;
}

const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onOpenChange,
  onClose,
  staveToolState,
  paperWidth,
  paperHeight,
  barrelExportData
}) => {

  const [dpi, setDpi] = useState<string>('300');
  const [outputFormat, setOutputFormat] = useState<string>('Png');
  const [exportIsAvailable, setExportIsAvailable] = useState<boolean>(false);
  const [isPendingGeneration, setIsPendingGeneration] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState("");

  function printPaperSizeInPixels(dpi: string, paperWidth: number, paperHeight: number) {
    const pxWidth = Math.floor(pixelsFromCm(Number(dpi), paperWidth * 0.1));
    const pxHeight = Math.floor(pixelsFromCm(Number(dpi), paperHeight * 0.1));
    return `Pixel size: ${pxWidth} x ${pxHeight}`;
  }

  function handleGenerate(dpi: string, outputFormat: string, barrelExportData: BarrelExportData) {
    exportTemplateImage(
      barrelExportData,
      outputFormat,
      dpi,
      setDownloadUrl,
      setExportIsAvailable,
      setIsPendingGeneration
    );
  }

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} onClose={() => setExportIsAvailable(false)}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {`Export : ${staveToolState} template`}
            </ModalHeader>
            <ModalBody>
              <FormInput
                step={50}
                callback={(e) => {
                  setDpi(e.target.value);
                  setExportIsAvailable(false);
                }}
                name="dpi"
                value={dpi}
                type="number"
              />
              <div className="text-xs text-gray-500">{printPaperSizeInPixels(dpi, paperWidth, paperHeight)}</div>
              <RadioGroup
                onChange={(e) => {
                  setOutputFormat(e.target.value);
                  setExportIsAvailable(false);
                }}
                label="Output format"
                defaultValue={outputFormat}
              >
                <Radio value="Png">Png</Radio>
                <Radio value="Jpeg">Jpeg</Radio>
                <Radio isDisabled value="Pdf">
                  Pdf
                </Radio>
              </RadioGroup>
            </ModalBody>
            <ModalFooter>
              {/* {!isPendingGeneration && <Button onClick={onClose}>Close</Button>} */}
              <ExportButton
                exportFunction={() => handleGenerate(dpi, outputFormat, barrelExportData)}
                isLoading={isPendingGeneration}
                isDownload={exportIsAvailable}
                downloadURl={downloadUrl}
                outputFormat={outputFormat}
              />

            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ExportModal;

