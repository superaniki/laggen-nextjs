"use client";

import {
  NavbarItem,
  Button,
  Avatar,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Modal, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalFooter,
  useDisclosure
} from '@nextui-org/react';
import { useSession, signOut as clientSignOut, signIn as clientSignIn } from 'next-auth/react'
import * as actions from "@/actions";
import { useState } from 'react';

export default function HeaderAuth() {
  const session = useSession();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  let authContent: React.ReactNode;
  
  const handleSignIn = async (provider: string) => {
    await clientSignIn(provider, { callbackUrl: '/' });
    onClose();
  };
  
  if (session.status === "loading") {
    authContent = null
  } else if (session.data?.user) {
    authContent = <Popover placement="left">
      <PopoverTrigger>
        <div className="flex gap-3">
          <div className="m-2">{session.data.user.name}</div>
          <div><Avatar src={session.data.user.image || ''} /></div>
        </div>
      </PopoverTrigger>
      <PopoverContent>
        <div className="p-4">
          <Button 
            onClick={() => clientSignOut({ callbackUrl: '/' })}
            type="button"
          >
            Sign out
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  } else {
    authContent = (
      <>
        <NavbarItem>
          <Button onClick={onOpen} color="secondary" variant="bordered">
            Sign In
          </Button>
        </NavbarItem>

        <NavbarItem>
          <Button onClick={onOpen} color="primary" variant="flat">
            Sign Up
          </Button>
        </NavbarItem>
        
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center">
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">Sign in to Laggen</ModalHeader>
                <ModalBody>
                  <div className="flex flex-col gap-4">
                    <Button 
                      onClick={() => handleSignIn('google')} 
                      className="bg-white border border-gray-300 hover:bg-gray-100 text-gray-800"
                      startContent={<GoogleIcon />}
                    >
                      Continue with Google
                    </Button>
                    {/* Add more providers here in the future */}
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Cancel
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </>
    );
  }

  return authContent;
}

// Google icon component
function GoogleIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
      <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" />
      <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" />
      <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" />
      <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" />
    </svg>
  );
}