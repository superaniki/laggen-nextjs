"use client"
import { Button, Card, CardBody, CardHeader, Divider, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/react";
import { BarrelWithData } from "@/db/queries/barrels";
import paths from "@/paths";
import Link from "next/link";
import { useState } from "react";
import toast, { Toaster } from 'react-hot-toast';
import { useSession } from "next-auth/react";
import LoadingString from "@/ui/loading-string";
import dynamic from "next/dynamic";

// Workaround for Canvas import error
const BarrelPreviewCanvas = dynamic(() => import("../canvas/barrel-preview-canvas"), {
  ssr: false,
});

export enum BarrelType {
  public,
  private
}

interface BarrelCardProps {
  barrel: BarrelWithData,
  color?: string,
  type: BarrelType
}

const PUBLIC_BARREL_COLOR = "bg-gradient-to-t from-green-100 to-blue-100";
const PRIVATE_BARREL_COLOR = "bg-gradient-to-t from-pink-100 to-blue-100";

export default function BarrelCard({ barrel, color, type }: BarrelCardProps) {
  const [isDeleted, setIsDeleted] = useState(false);
  const [isPending, setIsPending] = useState<boolean | string>(false);
  const session = useSession();

  //let author: string | React.ReactNode = <>Loading<span></span></>;
  let isMyBarrel = false;
  if (session.status !== "loading") {
    if (session.data?.user?.id === barrel.userId)
      isMyBarrel = true;
  }

  function actionHandler(key: React.Key) {
    if (key === "delete") {
      const data = { id: barrel.id }

      setIsPending("Deleting");
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
          setIsDeleted(true);
        })
        .catch(error => {
          console.log("Error:", error)
        });
    }
  }

  let author: string | React.ReactNode = <LoadingString />;
  if (session.status !== "loading") {
    if (session.data?.user?.id === barrel.userId)
      author = "You";
    else
      author = barrel.user.name;
  }

  let barrelColor = PUBLIC_BARREL_COLOR;
  if (type === BarrelType.private)
    barrelColor = PRIVATE_BARREL_COLOR;

  return <>
    {isPending && <div className="loading">{isPending}<span></span></div>}
    {!isDeleted && !isPending &&
      <Card isHoverable={false} className="card mx-5 mb-10 pb-4 fadeIn-animation">
        <Link href={paths.barrelEdit(barrel.slug)}>
          <CardBody className={`overflow-hidden py-2 h-48 w-full ${barrelColor}`}>
            <BarrelPreviewCanvas barrelDetails={barrel.barrelDetails} color={"#707070"} />
          </CardBody>
        </Link>
        <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
          <div className="flex w-full justify-between">
            <div>
              <h4 className="font-bold text-large overflow-hidden text-ellipsis">{barrel.barrelDetails.name}</h4>
              <small className="text-default-500">by {author}</small>
            </div>
            <div>
              <Dropdown backdrop="transparent">
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
                  {isMyBarrel === true ? <DropdownItem key="delete"> Delete </DropdownItem> : <DropdownItem className="hidden" />}
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>
        </CardHeader>
      </Card >
    }

  </>
}