import React from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, RadioGroup, Radio } from '@nextui-org/react';
import FormInput from '@/ui/form-input';
import ExportButton from '@/ui/export-button';


interface ExportModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
  staveToolState: string;
  dpi: string;
  setDpi: (value: string) => void;
  outputFormat: string;
  setOutputFormat: (value: string) => void;
  printPaperSizeInPixels: () => string;
  handleGenerate: () => void;
  isPendingGeneration: boolean;
  exportIsAvailable: boolean;
  downloadUrl: string;
  setExportIsAvailable: (value: boolean) => void;
}

const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onOpenChange,
  onClose,
  staveToolState,
  dpi,
  setDpi,
  outputFormat,
  setOutputFormat,
  printPaperSizeInPixels,
  handleGenerate,
  isPendingGeneration,
  exportIsAvailable,
  downloadUrl,
  setExportIsAvailable,
}) => {
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
              <div className="text-xs text-gray-500">{`${printPaperSizeInPixels()}`}</div>
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
                exportFunction={handleGenerate}
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

