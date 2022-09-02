import type { LoaderFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import Header from "~/components/header";
import type { UserWithNotes } from "~/types";
import { authenticator } from "~/utils/auth.server";
import { db } from "~/utils/db.server";

import { FiSend } from "react-icons/fi";
import { IoArchiveOutline, IoFolderOpenOutline } from "react-icons/io5";
import { json, useLoaderData } from "superjson-remix";
import NoteCard from "~/components/noteCard";

type LoaderData = {
	isLoggedIn: boolean;
	user?: UserWithNotes | null;
};

export const loader: LoaderFunction = async ({ request }) => {
	const userId = await authenticator.isAuthenticated(request);
	const isLoggedIn = userId !== null;

	if (!isLoggedIn) return json({ isLoggedIn, user: null });

	const user = await db.user.findFirst({
		where: {
			id: userId,
		},
		include: {
			notes: {
				include: {
					tags: true,
				},
				orderBy: {
					createdAt: "desc",
				},
			},
		},
	});

	return json({ isLoggedIn, user });
};

export default function Index() {
	const { isLoggedIn, user } = useLoaderData<LoaderData>();

	return (
		<>
			<Header isLoggedIn={isLoggedIn} />
			<main className="mx-gutter py-8">
				<h1 className="font-bold text-5xl mb-12">Your Notes</h1>
				<div className="grid md:grid-cols-[auto_1fr] gap-x-12 gap-y-24">
					<aside className="sticky top-12 flex flex-col gap-8 bg-paper bg-white rounded-2xl pl-6 pr-12 py-8 h-fit">
						<div className="flex items-center gap-4 text-lg">
							<IoFolderOpenOutline className="h-8 w-8" />
							<Link to="/">Notes</Link>
						</div>
						<div className="flex items-center gap-4 text-lg">
							<FiSend className="h-8 w-8" />
							<Link to="/submit">Submit</Link>
						</div>
						<div className="flex items-center gap-4 text-lg">
							<IoArchiveOutline className="h-8 w-8" />
							<Link to="/">Archive</Link>
						</div>
					</aside>

					<div className="flex flex-col gap-8">
						{user?.notes?.map((note) => {
							return <NoteCard key={note.id} note={note} />;
						})}
					</div>
				</div>
			</main>
		</>
	);
}
