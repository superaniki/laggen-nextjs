


/* <BarrelsList fetchData={() => fetchPostByTopicSlug(slug)} /> 

interface PostListProps {
  fetchData: () => Promise<PostWithData[]>
}

// TODO: Get list of posts into this component somehow
export default async function PostList({ fetchData }: PostListProps) {

*/
import type { BarrelWithUser } from "@/db/queries/barrels";

interface BarrelsListProps {
  fetchData: () => Promise<BarrelWithUser[]>
}

export default async function BarrelsList({ fetchData }: BarrelsListProps) {
  const data = await fetchData();

  function entries(data: BarrelWithUser) {
    const entries = Object.entries(data);
    const mappedEntries = entries.map(([key, value]) => {
      return <li key={key} className="first:font-bold">
        <span>{key} : </span>
        <span>{value.toString()}</span>
      </li>;

    });
    return mappedEntries;
  }

  return <div>
    <div className="font-bold text-large">List of barrels</div>
    <ul>
      {data.map((data) => (<div className="pb-5" key={data.id}>
        {entries(data)}
      </div>
      ))}
      <hr />
    </ul>
  </div >
}