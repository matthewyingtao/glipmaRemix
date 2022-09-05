import type { LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import Header from "~/components/header";
import type { NoteWithTags } from "~/types";
import { authenticator } from "~/utils/auth.server";
import { db } from "~/utils/db.server";

import { FiSend } from "react-icons/fi";
import { IoArchiveOutline, IoFolderOpenOutline } from "react-icons/io5";
import NoteCard from "~/components/noteCard";

type LoaderData = {
	notes?: NoteWithTags[] | null;
};

export const loader: LoaderFunction = async ({ request }) => {
	const userId = await authenticator.isAuthenticated(request);
	const isLoggedIn = userId !== null;

	if (!isLoggedIn) return redirect("/login");

	const notes = await db.note.findMany({
		where: {
			userId,
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

export default function Index() {
	const { notes } = useLoaderData<LoaderData>();

	return (
		<>
			<Header />
			<main className="mx-gutter pt-4 pb-16">
				<h1 className="font-bold text-5xl mb-12">Your Notes</h1>
				<div className="grid md:grid-cols-[auto_1fr] gap-x-12 gap-y-24">
					<aside className="sticky top-12 flex flex-col gap-8 bg-paper bg-white rounded-2xl pl-6 pr-12 py-8 h-fit">
						<div className="flex items-center gap-4 text-lg">
							<IoFolderOpenOutline className="h-8 w-8" />
							<Link to="/" prefetch="intent">
								Notes
							</Link>
						</div>
						<div className="flex items-center gap-4 text-lg">
							<FiSend className="h-8 w-8" />
							<Link to="/new" prefetch="intent">
								Submit
							</Link>
						</div>
						<div className="flex items-center gap-4 text-lg">
							<IoArchiveOutline className="h-8 w-8" />
							<Link to="/" prefetch="intent">
								Archive
							</Link>
						</div>
					</aside>

					<div className="flex flex-col gap-8">
						{notes?.map((note) => {
							return (
								<NoteCard
									key={note.id}
									note={note as unknown as NoteWithTags}
								/>
							);
						})}
					</div>
				</div>
			</main>
		</>
	);
}
