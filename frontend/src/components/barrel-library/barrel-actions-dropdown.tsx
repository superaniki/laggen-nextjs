import { BarrelWithData } from "@/db/queries/barrels";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from 'react-hot-toast';

interface BarrelActionsDropdownProps {
  barrel: BarrelWithData,
  deleteEnabled: boolean,
  handleDelete: () => void, // function callback
  setIsPending: (status: boolean) => void, // function callback
}

export default function BarrelActionsDropdown({ barrel, deleteEnabled, handleDelete, setIsPending }: BarrelActionsDropdownProps) {
  const router = useRouter();

  function actionHandler(key: React.Key) {
    if (key === "delete") {
      const data = { id: barrel.id }

      setIsPending(true)
      fetch(
        '/api/barrels/delete',
        {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        }
      ).then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
        .then(data => {
          toast.success("Barrel " + barrel.barrelDetails.name + "is deleted!", { position: 'bottom-center' })
          setIsPending(false);
          handleDelete();
          router.refresh(); // YES
        })
        .catch(error => {
          console.log("Error:", error)
        });
    }

    if (key === "duplicate") {
      const data = { id: barrel.id }
      fetch(
        '/api/barrels/duplicate',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        }
      ).then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
        .then(data => {
          toast.success("Barrel " + barrel.barrelDetails.name + "is duplicated!", { position: 'bottom-center' })
        })
        .catch(error => {
          console.log("Error:", error)
        });
    }
  }

  return <Dropdown backdrop="transparent">
    <DropdownTrigger>
      <Button isIconOnly variant="bordered" className="">
        <svg width="40px" height="40px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 10L12 14L16 10" stroke="#200E32" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Button>
    </DropdownTrigger>
    <DropdownMenu onAction={actionHandler} aria-label="Link Actions">
      <DropdownItem key="duplicate">
        Duplicate
      </DropdownItem>
      {deleteEnabled === true ? <DropdownItem key="delete"> Delete </DropdownItem> : <DropdownItem className="hidden" />}
    </DropdownMenu>
  </Dropdown>
}
