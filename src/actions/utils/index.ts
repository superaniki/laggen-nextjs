
import { db } from "@/db";

async function checkSlugUniqueness(slug: string) {
  console.log("searching for slug: "+slug)
  const exists = null === await db.barrel.findUnique({
    where: {
      slug: slug,
    },
  });
  console.log("slug is unique: "+ exists);
  return exists; // Returns true if unique, false if exists
}

export async function createSlug(name:string){
  let slug = name.replace(/\s+/g, '-').replace(/å/g, 'a')
  .replace(/ä/g, 'a').replace(/ö/g, 'o').toLowerCase();

  let slugId = 0;
  while(!await checkSlugUniqueness(slug)){
    console.log("not unique slug")
    slug += slugId.toString();
    slugId++;
    console.log("new slug: "+slug)
  }

  return slug;
}