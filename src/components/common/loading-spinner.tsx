import { CircularProgress } from "@nextui-org/react";


export default function LoadingSpinner() {
  return <div className="h-full flex items-center justify-center">
    <CircularProgress color="primary" aria-label="Loading..." />
  </div>;
}