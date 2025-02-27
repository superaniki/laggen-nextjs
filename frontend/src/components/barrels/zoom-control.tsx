import React from 'react'
import { Button } from '@nextui-org/react'
import { round } from "./canvas/commons/barrel-math";

interface ZoomControlProps {
  toolScale: number
  setToolScale: React.Dispatch<React.SetStateAction<number>>
}

export const ZoomControl: React.FC<ZoomControlProps> = ({ toolScale, setToolScale }) => {
  return (
    <span className="absolute m-3 right-0">
      <Button
        className="shadow-medium min-w-10 rounded-full bg-white text-xl border-solid border-2 border-gray-200 p-0"
        onClick={() => setToolScale((current) => round(current + 0.2, 2))}
      >
        +
      </Button>
      <Button
        className="shadow-medium min-w-10 rounded-full bg-white text-xl border-solid border-2 border-gray-200 p-0"
        onClick={() => setToolScale((current) => round(current - 0.2, 2))}
      >
        -
      </Button>
      <div className="text-center">{toolScale}</div>
    </span>
  )
}