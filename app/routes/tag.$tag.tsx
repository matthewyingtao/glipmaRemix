import type { LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import Header from "~/components/header";
import NoteCard from "~/components/noteCard";
import SidebarLayout from "~/components/sidebarLayout";
import type { NoteWithTags } from "~/types";
import type { AuthUserData } from "~/utils/auth.server";
import { authenticator } from "~/utils/auth.server";
import { db } from "~/utils/db.server";

interface LoaderData {
	userData: AuthUserData;
	tagName: string;
	notes: NoteWithTags[];
}

export const loader: LoaderFunction = async ({ request, params }) => {
	const { userId, pfp } = (await authenticator.isAuthenticated(request)) || {};
	const isLoggedIn = userId !== undefined;

	if (!isLoggedIn) return redirect("/");

	const tagName = params.tag || "";

	const notes = await db.note.findMany({
		where: {
			userId,
			tags: {
				some: {
					name: {
						equals: tagName,
					},
				},
			},
		},
		include: {
			tags: true,
		},
	});

	return {
		tagName,
		userData: {
			userId,
			pfp,
		},
		notes,
	};
};

export default function Tag() {
	const { notes, tagName, userData } = useLoaderData<LoaderData>();

	return (
		<>
			<Header userId={userData.userId} pfp={userData.pfp} />
			<main className="mx-gutter pt-4 pb-16">
				<SidebarLayout>
					<div>
						<h1 className="font-bold text-5xl mb-12">
							Posts tagged: "{tagName}"
						</h1>
						<div className="flex flex-col gap-8">
							{notes?.map((note) => (
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
