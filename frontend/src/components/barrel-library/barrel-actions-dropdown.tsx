import { BarrelWithData } from "@/db/queries/barrels";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from 'react-hot-toast';
import { useState } from "react";
import paths from "@/paths";

interface BarrelActionsDropdownProps {
  barrel: BarrelWithData,
  deleteEnabled: boolean,
  handleDelete: () => void, // function callback
  setIsPending: (status: boolean) => void, // function callback
}

export default function BarrelActionsDropdown({ barrel, deleteEnabled, handleDelete, setIsPending }: BarrelActionsDropdownProps) {
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isDeleting, setIsDeleting] = useState(false);

  function actionHandler(key: React.Key) {
    if (key === "edit") {
      // Navigate to the barrel edit page
      router.push(paths.barrelEdit(barrel.slug));
    }
    
    if (key === "delete") {
      // Open confirmation modal instead of immediately deleting
      onOpen();
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
          toast.success(`Barrel "${barrel.barrelDetails.name}" was duplicated!`, { position: 'bottom-center' })
        })
        .catch(error => {
          console.log("Error:", error)
        });
    }
  }

  // Function to handle the actual deletion after confirmation
  const handleConfirmDelete = () => {
    const data = { id: barrel.id }
    setIsDeleting(true);
    setIsPending(true);
    
    fetch(
      '/api/barrels/delete',
      {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }
    ).then(response => {
      if (!response.ok) {
        return response.json().then(data => {
          throw new Error(data.message || 'Failed to delete barrel');
        });
      }
      return response.json();
    })
      .then(data => {
        if (data.success) {
          toast.success(`Barrel "${barrel.barrelDetails.name}" was deleted successfully!`, { position: 'bottom-center' });
          setIsPending(false);
          handleDelete();
          router.refresh(); // Refresh the page to update the barrel list
        } else {
          throw new Error(data.message || 'Unknown error occurred');
        }
      })
      .catch(error => {
        console.error("Error:", error);
        toast.error(`Failed to delete barrel: ${error.message}`, { position: 'bottom-center' });
        setIsPending(false);
      })
      .finally(() => {
        setIsDeleting(false);
      });
  };

  return (
    <>
      <Dropdown backdrop="transparent">
        <DropdownTrigger>
          <Button isIconOnly variant="bordered" className="">
            <svg width="40px" height="40px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 10L12 14L16 10" stroke="#200E32" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Button>
        </DropdownTrigger>
        <DropdownMenu onAction={actionHandler} aria-label="Link Actions">
          <DropdownItem key="edit">
            Edit
          </DropdownItem>
          <DropdownItem key="duplicate">
            Duplicate
          </DropdownItem>
          {deleteEnabled === true ? <DropdownItem key="delete"> Delete </DropdownItem> : <DropdownItem className="hidden" />}
        </DropdownMenu>
      </Dropdown>

      {/* Confirmation Modal */}
      <Modal 
        isOpen={isOpen} 
        onOpenChange={onOpenChange}
        backdrop="blur"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Confirm Deletion</ModalHeader>
              <ModalBody>
                <p>Are you sure you want to delete barrel <strong>"{barrel.barrelDetails.name}"</strong>?</p>
                <p className="text-danger">This action cannot be undone.</p>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button 
                  color="danger" 
                  onPress={() => {
                    handleConfirmDelete();
                    onClose();
                  }}
                  isLoading={isDeleting}
                >
                  Delete
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}
