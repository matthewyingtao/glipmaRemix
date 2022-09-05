import type { LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import Header from "~/components/header";
import type { NoteWithTags } from "~/types";
import { authenticator } from "~/utils/auth.server";
import { db } from "~/utils/db.server";

import NoteCard from "~/components/noteCard";
import SidebarLayout from "~/components/sidebarLayout";

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
				<SidebarLayout>
					<div>
						<h1 className="font-bold text-5xl mb-12">Your Notes</h1>
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
				</SidebarLayout>
			</main>
		</>
	);
}
