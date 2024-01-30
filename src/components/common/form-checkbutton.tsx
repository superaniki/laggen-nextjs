import { Checkbox } from "@nextui-org/react"
import { ChangeEvent } from "react";

interface FormCheckboxProps {
  name: string,
  value: Boolean,
  callback: (event: ChangeEvent<HTMLInputElement>) => void;
}

export default function FormCheckBox({ name, value, callback }: FormCheckboxProps) {
  const label = name[0].toUpperCase() + name.substring(1)
  return <div key={name} className="m-2 flex ">
    <Checkbox name={name} isSelected={Boolean(value)} onChange={(event) => callback(event)}>
      {name}
    </Checkbox>
  </div>
}