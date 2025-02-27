"use client";

import {
  NavbarItem,
  Button,
  Avatar,
  Popover,
  PopoverTrigger,
  PopoverContent
} from '@nextui-org/react';
//import { auth } from '@/auth';
import { useSession } from 'next-auth/react'
import * as actions from "@/actions";

export default function HeaderAuth() {
  const session = useSession();
  let authContent: React.ReactNode;
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
          <form action={actions.signOut}>
            <Button type="submit">Sign out</Button>
          </form>
        </div>
      </PopoverContent>
    </Popover>
  } else {
    authContent = (
      <>
        <NavbarItem>
          <form action={actions.signIn}>
            <Button type="submit" color="secondary" variant="bordered">
              Sign In
            </Button>
          </form>
        </NavbarItem>

        <NavbarItem>
          <form action={actions.signOut}>
            <Button type="submit" color="primary" variant="flat">
              Sign Up
            </Button>
          </form>

        </NavbarItem>
      </>
    );
  }

  return authContent;
}