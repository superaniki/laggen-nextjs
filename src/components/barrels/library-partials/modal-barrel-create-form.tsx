'use client';


import { useFormState } from 'react-dom';
import {
  Input,
  Button,
  Textarea,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@nextui-org/react';
import * as actions from '@/actions';
import FormButton from '@/components/common/form-button';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface PostCreateFormProps {
  slug: string;
}

export default function ModalBarrelCreateForm() {
  //const [formState, action] = useFormState(actions.createBarrel.bind(null, slug), {
  const [formState, action] = useFormState(actions.createBarrel, { success: false, errors: {} });
  const [isOpen, setIsOpen] = useState(false);
  //const action = actions.createPost.bind(null, bind(null, slug))


  useEffect(() => {
    /*
    if (formState.errors.firstName) {
      // do the your logic here
    }
    */
    console.log("formstate updated");
    console.log(JSON.stringify(formState));
    if (formState.success) {
      setIsOpen(false);
      toast.success("Added a new barrel", { position: 'bottom-center' });
    }
  }, [formState]); // ✅ 

  return (
    <Popover isOpen={isOpen} onOpenChange={(open) => setIsOpen(open)} placement="left">
      <PopoverTrigger>
        <Button className="flex flex-auto" color="default">New Barrel</Button>
      </PopoverTrigger>
      <PopoverContent>
        <form action={action}>
          <div className="flex flex-col gap-4 p-4 w-80">
            <h3 className="text-lg">New Barrel</h3>

            <Input
              isInvalid={!!formState?.errors.name}
              errorMessage={formState?.errors.name?.join(', ')}
              name="name"
              label="Name"
              labelPlacement="outside"
              placeholder="Name"
            />
            <Textarea
              isInvalid={!!formState?.errors.notes}
              errorMessage={formState?.errors.notes?.join(', ')}
              name="notes"
              label="Notes"
              labelPlacement="outside"
              placeholder="Notes"
            />

            {
              formState?.errors._form ?
                <div className="rounded p-2 bg-red-200 border border-red-400">
                  {formState.errors._form.join(', ')}
                </div> : null
            }

            <FormButton>Save</FormButton>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
}