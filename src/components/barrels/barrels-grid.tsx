"use server"
import type { BarrelWithUser } from "@/db/queries/barrels";
import BarrelCard from "./barrel-card";
import { deleteBarrel } from "@/actions";
import { useFormState } from "react-dom";

interface BarrelsListProps {
  fetchData: () => Promise<BarrelWithUser[]>
}


export default async function BarrelsGrid({ fetchData }: BarrelsListProps) {
  const barrels = await fetchData();

  return <div className="grid grid-cols-3 gap-0">
    {barrels.map((barrel) => (
      <BarrelCard key={"card" + barrel.id} barrel={barrel} color={"#BBBBEE"} />
    ))}
  </div>
}