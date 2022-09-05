import type { LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import Header from "~/components/header";
import NoteCard from "~/components/noteCard";
import SidebarLayout from "~/components/sidebarLayout";
import type { NoteWithTags, UserWithNotes } from "~/types";
import { authenticator } from "~/utils/auth.server";
import { db } from "~/utils/db.server";

interface LoaderData {
	user: UserWithNotes;
}

export const loader: LoaderFunction = async ({ request, params }) => {
	const { userId: currentUserId } =
		(await authenticator.isAuthenticated(request)) || {};
	const isLoggedIn = currentUserId !== undefined;

	if (!isLoggedIn) return redirect("/");

	const userId = params.userId || "";

	const user = await db.user.findUnique({
		where: {
			id: userId,
		},
		include: {
			notes: {
				where: {
					isPublic: true,
				},
				include: {
					tags: true,
				},
				orderBy: {
					createdAt: "desc",
				},
			},
		},
	});

	return {
		user,
	};
};

export default function Tag() {
	const { user } = useLoaderData<LoaderData>();

	return (
		<>
			<Header userId={user.id} pfp={user.profilePicture || ""} />
			<main className="mx-gutter pt-4 pb-16">
				<SidebarLayout>
					<div>
						<h1 className="font-bold text-5xl mb-20 underline decoration-wavy decoration-blue-500 underline-offset-8 decoration-4">
							{user?.username}'s public notes
						</h1>
						<div className="flex flex-col gap-8">
							{user.notes?.map((note) => (
								<NoteCard
									key={note.id}
									note={note as unknown as NoteWithTags}
								/>
							))}
						</div>
					</div>
				</SidebarLayout>
			</main>
		</>
	);
}
