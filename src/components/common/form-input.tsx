
import { Input } from "@nextui-org/react";
import { ChangeEvent } from "react";


interface FormInputProps {
  name: string,
  value: string,
  type: string,
  callback: (event: ChangeEvent<HTMLInputElement>) => void;
}

export default function FormInput({ name, value, type, callback }: FormInputProps) {
  const label = name[0].toUpperCase() + name.substring(1)
  return <div className="mb-1">
    <Input fullWidth key={name} name={name} labelPlacement="outside-left" value={value}
      step={10} onChange={e => callback(e)} type={type} label={label} ></Input>
  </div>
};

