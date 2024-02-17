
"use server";
import BarrelShow from "@/components/barrels/barrel-show";
import { fetchOneBarrelById } from "@/db/queries/barrels";
import { Barrel } from "@prisma/client";
import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";


interface BarrelShowPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata(
  { params }: BarrelShowPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { id } = params;
  const barrelName = await fetchOneBarrelById(id).then(barrel => barrel !== null && barrel);

  return {
    title: "Show barrel " + barrelName,
  }
}


export default async function BarrelShowPage({ params }: BarrelShowPageProps) {
  const { id } = params;
  ////await new Promise(resolve => setTimeout(resolve, 2500));

  let barrel = await fetchOneBarrelById(id);

  if (!barrel)
    return notFound();

  return (
    <div className="w-full pt-5">
      <div className="container relative min-h-[600px] w-[1024px] border-gray-500 mx-auto">
        <BarrelShow barrel={barrel.barrelDetails} />
      </div>
    </div>
  )
}


/*


function entries(data: BarrelWithData) {
    const entries = Object.entries(data);
    const mappedEntries = entries.map(([key, value]) => {
      return <li key={key} className="first:font-bold">
        <span>{key} : </span>
        <span>{value.toString()}</span>
      </li>;

    });
    return mappedEntries;
  }


import Link from "next/link";
import PostShow from "@/components/posts/post-show";
import CommentList from "@/components/comments/comment-list";
import CommentCreateForm from "@/components/comments/comment-create-form";
import paths from "@/paths";
import { fetchCommentsByPostId } from "@/db/queries/comments";
import { Suspense } from "react";
import PostShowLoading from "@/components/posts/post-show-loading,";


interface PostShowPageProps {
  params: {
    slug: string;
    postId: string;
  };
}

export default async function PostShowPage({ params }: PostShowPageProps) {
  const { slug, postId } = params;

  return (
    <div className="space-y-3">
      <Link className="underline decoration-solid" href={paths.topicShow(slug)}>
        {"< "}Back to {slug}
      </Link>
      <Suspense fallback={<PostShowLoading />}>
        <PostShow postId={postId} />
      </Suspense>
      <CommentCreateForm postId={postId} startOpen />
      <CommentList postId={postId} />
    </div>
  );
}


*/