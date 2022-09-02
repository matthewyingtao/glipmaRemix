import type { Note, Tag, User } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import Header from "~/components/header";
import { authenticator } from "~/utils/auth.server";
import { db } from "~/utils/db.server";

import { FiSend } from "react-icons/fi";
import { IoArchiveOutline, IoFolderOpenOutline } from "react-icons/io5";
import { getColor } from "~/utils/utils";

type NoteWithTags = Note & {
	tags: Tag[];
};

type UserWithNotes = User & {
	notes: NoteWithTags[];
};

type LoaderData = {
	isLoggedIn: boolean;
	user?: UserWithNotes | null;
};

export const loader: LoaderFunction = async ({
	request,
}): Promise<LoaderData> => {
	const userId = await authenticator.isAuthenticated(request);
	const isLoggedIn = userId !== null;

	if (!isLoggedIn) return { isLoggedIn, user: null };

	const user = await db.user.findFirst({
		where: {
			id: userId,
		},
		include: {
			notes: {
				include: {
					tags: true,
				},
			},
		},
	});

	return { isLoggedIn, user };
};

export default function Index() {
	const { isLoggedIn, user } = useLoaderData<LoaderData>();

	return (
		<>
			<Header isLoggedIn={isLoggedIn} />
			<main className="mx-gutter py-8">
				<h1 className="font-bold text-5xl mb-12">Your Notes</h1>
				<div className="grid grid-cols-[auto_1fr] gap-x-12">
					<aside className="flex flex-col gap-8 bg-paper bg-white rounded-2xl pl-6 pr-12 py-8 h-fit">
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
							return (
								<div
									className="bg-paper bg-yellow-200 p-8 rounded-2xl shadow-md"
									key={note.id}
								>
									<div className="flex gap-4 items-center mb-4">
										<h3 className="text-lg text-gray-700 font-bold">
											{note.title}
										</h3>
										<div className="flex gap-2">
											{note.tags?.map((tag) => {
												return (
													<div key={tag.id}>
														<span
															className="px-2 py-[2px] rounded-full"
															style={{
																backgroundColor: getColor(tag.hue),
															}}
														>
															{tag.name}
														</span>
													</div>
												);
											})}
										</div>
									</div>
									<div dangerouslySetInnerHTML={{ __html: note.content }} />
								</div>
							);
						})}
					</div>
				</div>
			</main>
		</>
	);
}
