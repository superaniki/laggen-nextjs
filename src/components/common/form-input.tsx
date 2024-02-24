
import { Input } from "@nextui-org/react";
import { ChangeEvent } from "react";


interface FormInputProps {
  name: string,
  value: string,
  type: string,
  step?: number,
  callback: (event: ChangeEvent<HTMLInputElement>) => void;
  max?: number | undefined,
  min?: number | undefined
}

export default function FormInput({ max = undefined, min = undefined, name, step = 10, value, type, callback }: FormInputProps) {
  const label = name[0].toUpperCase() + name.substring(1)
  return <div className="mb-1">
    <Input fullWidth key={name} name={name} labelPlacement="outside-left" value={value}
      step={step} max={max} min={min} onChange={e => callback(e)} type={type} label={label} ></Input>
  </div>
};

