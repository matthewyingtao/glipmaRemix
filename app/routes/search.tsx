import type { LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useLoaderData, useSearchParams } from "@remix-run/react";
import Header from "~/components/header";
import NoteCard from "~/components/noteCard";
import SidebarLayout from "~/components/sidebarLayout";
import type { NoteWithTags } from "~/types";
import type { AuthUserData } from "~/utils/auth.server";
import { authenticator } from "~/utils/auth.server";
import { db } from "~/utils/db.server";

type LoaderData = {
	userData: AuthUserData;
	notes?: NoteWithTags[] | null;
};

export const loader: LoaderFunction = async ({ request }) => {
	const { userId, pfp } = (await authenticator.isAuthenticated(request)) || {};
	const isLoggedIn = userId !== undefined;

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

	return {
		userData: { userId, pfp },
		notes,
	};
};

export default function Search() {
	const { notes, userData } = useLoaderData<LoaderData>();
	const [searchParams] = useSearchParams();

	const query = searchParams.get("q");

	return (
		<>
			<Header userId={userData.userId} pfp={userData.pfp} />
			<main className="mx-gutter pt-4 pb-16">
				<SidebarLayout>
					<div>
						<h1 className="font-bold text-5xl mb-20 underline decoration-wavy decoration-blue-500 underline-offset-8 decoration-4">
							Results for: "{query}"
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
