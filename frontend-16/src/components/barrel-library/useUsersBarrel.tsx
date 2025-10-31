import { BarrelWithData } from "@/db/queries/barrels";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function useUsersBarrel(barrel: BarrelWithData): [string | React.ReactNode, boolean, boolean] {
  const [isUsersBarrel, setIsUserBarrel] = useState<boolean>(false);
  // Set a default author name to avoid loading flicker
  const [author, setAuthor] = useState<string>(barrel.user?.name || "Unknown");
  const [isLoading, setIsLoading] = useState<boolean>(false); // Start with false to avoid loading indicator
  const session = useSession();

  useEffect(() => {
    // Only set loading to true if session is actually loading
    if (session.status === "loading") {
      setIsLoading(true);
    } else {
      // Session data is available
      if (session.data?.user?.id === barrel.userId) {
        setAuthor("You");
        setIsUserBarrel(true);
      } else {
        setAuthor(barrel.user?.name || "Unknown");
        setIsUserBarrel(false);
      }
      setIsLoading(false);
    }
  }, [session, barrel]);

  return [author, isUsersBarrel, isLoading];
}