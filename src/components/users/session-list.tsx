import { fetchAllSessions } from "@/db/queries/sessions";
import { Session } from "@prisma/client";

export async function SessionsList() { //{ fetchData }: UsersListProps) {
  const data = await fetchAllSessions();


  function entries(data: Session) {
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
    <div className="font-bold">List of Sessions</div>
    <ul>
      {data.map((data) => (<div key={data.id}>
        {entries(data)}
      </div>
      ))}
    </ul>
  </div >
}