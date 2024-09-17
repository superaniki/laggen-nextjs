'use client';

import { useFormStatus } from 'react-dom';
import { Button } from '@nextui-org/react';

interface FormButtonProps {
  children: React.ReactNode;
  isDisabled?: boolean,
  color?: any
}

export default function FormButton({ children, isDisabled = false, color = "default" }: FormButtonProps) {
  const { pending } = useFormStatus();

  return <Button color={color} isDisabled={isDisabled} type="submit" isLoading={pending}>
    {children}
  </Button>
};
