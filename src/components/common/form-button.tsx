'use client';

import { useFormStatus } from 'react-dom';
import { Button } from '@nextui-org/react';

interface FormButtonProps {
  children: React.ReactNode;
  isDisabled?: boolean,
  primary?: boolean
}

export default function FormButton({ children, isDisabled = false, primary = false }: FormButtonProps) {
  const { pending } = useFormStatus();

  return <Button isDisabled={isDisabled} type="submit" isLoading={pending}>
    {children}
  </Button>
};