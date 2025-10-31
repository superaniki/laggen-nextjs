

import { fetchAllUsers } from "@/db/queries/users";
import type { User } from "@prisma/client";

/*
interface UsersListProps {
  fetchData: () => Promise<User[]>
}
*/

export async function UsersList() { //{ fetchData }: UsersListProps) {
  const data = await fetchAllUsers();

  function entries(data: User) {
    const entries = Object.entries(data);
    const mappedEntries = entries.map(([key, value]) => {
      return <li key={key} className="first:font-bold">
        <span>{key} : </span>
        <span>{value?.toString()}</span>
      </li>;

    });
    return mappedEntries;
  }

  return <div className="mb-10">
    <div className="font-bold">List of Users</div>
    <ul>
      {data.map((data) => (<div key={data.id}>
        {entries(data)}
      </div>
      ))}
    </ul>
  </div >
}