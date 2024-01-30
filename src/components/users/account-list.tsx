

import { fetchAllAccounts } from "@/db/queries/accounts";
import { Account } from "@prisma/client";

export async function AccountsList() { //{ fetchData }: UsersListProps) {
  const data = await fetchAllAccounts();

  function entries(data: Account) {
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
    <div className="font-bold">List of Accounts</div>
    <ul>
      {data.map((data) => (<div key={data.id}>
        {entries(data)}
      </div>
      ))}
    </ul>
  </div >
}