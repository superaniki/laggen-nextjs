import { BarrelWithData } from "@/db/queries/barrels";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function useUsersBarrel(barrel: BarrelWithData): [string | React.ReactNode, boolean, boolean] {
  const [isUsersBarrel, setIsUserBarrel] = useState<boolean>(false);
  const [author, setAuthor] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const session = useSession();

  useEffect(() => {
    if (session.status !== "loading") {
      setIsLoading(false);
      if (session.data?.user?.id === barrel.userId) {
        setAuthor("You");
        setIsUserBarrel(true);
      } else {
        setAuthor(barrel.user?.name || "");
        setIsUserBarrel(false);
      }
    }
  }, [session, barrel]);

  return [author, isUsersBarrel, isLoading];
}