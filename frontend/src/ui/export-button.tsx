'use client';

import { useFormStatus } from 'react-dom';
import { Button } from '@nextui-org/react';

interface FormButtonProps {
  exportFunction: () => void,
  isLoading: boolean,
  isDownload: boolean,
  downloadURl: string,
  outputFormat: string
}

export default function ExportButton({ exportFunction, isLoading, isDownload, downloadURl, outputFormat }: FormButtonProps) {

  function handleDownload() {
    const anchor = document.createElement('a');
    anchor.href = downloadURl;
    anchor.download = `toolthing.${outputFormat.toLowerCase()}`;
    anchor.click();
  }

  if (isDownload)
    return <Button color={"success"} onClick={handleDownload} type="submit" isLoading={false}>
      Download Export
    </Button>

  if (isLoading)
    return <Button color={"secondary"} isLoading={true}>
      Generating
    </Button>

  return <Button color={"primary"} className="" onClick={exportFunction} type="submit" isLoading={false}>
    Generate Export
  </Button>
};
