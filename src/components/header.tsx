import Link from 'next/link';
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Input,

} from '@nextui-org/react';
import HeaderAuth from './header-auth';

export default function Header() {

  return (
    <Navbar maxWidth="full" className="shadow">
      <NavbarBrand>
        <Link href="/" className="font-extralight text-3xl text-gray-800">
          Laggen
        </Link>
      </NavbarBrand>


      <NavbarContent justify="end"><HeaderAuth /></NavbarContent>
    </Navbar>
  );
}

/*
    <NavbarContent justify="start">
        <NavbarItem>
          <Input />
        </NavbarItem>
      </NavbarContent>
*/