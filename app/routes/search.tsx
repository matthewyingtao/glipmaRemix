import type { LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useLoaderData, useSearchParams } from "@remix-run/react";
import Header from "~/components/header";
import NoteCard from "~/components/noteCard";
import type { NoteWithTags } from "~/types";
import { authenticator } from "~/utils/auth.server";
import { db } from "~/utils/db.server";

type LoaderData = {
	notes?: NoteWithTags[] | null;
};

export const loader: LoaderFunction = async ({ request }) => {
	const userId = await authenticator.isAuthenticated(request);
	const isLoggedIn = userId !== null;

	if (!isLoggedIn) return redirect("/login");

	const url = new URL(request.url);
	const query = url.searchParams.get("q");

	const notes = await db.note.findMany({
		where: {
			userId,
			content: {
				contains: query || "",
			},
		},
		include: {
			tags: true,
		},
		orderBy: {
			createdAt: "desc",
		},
	});

	return { notes };
};

export default function Search() {
	const { notes } = useLoaderData<LoaderData>();
	const [searchParams] = useSearchParams();

	const query = searchParams.get("q");

	return (
		<>
			<Header />
			<main className="mx-gutter pt-4 pb-16">
				<div className="mx-auto max-w-4xl">
					<h1 className="font-bold text-5xl mb-12">Results for: "{query}"</h1>
					<div className="flex flex-col gap-8">
						{notes?.map((note) => (
							<NoteCard key={note.id} note={note as unknown as NoteWithTags} />
						))}
					</div>
				</div>
			</main>
		</>
	);
}
