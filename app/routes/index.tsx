import type { Note, Tag, User } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { authenticator } from "~/utils/auth.server";
import { db } from "~/utils/db.server";

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

	if (!isLoggedIn) {
		return {
			isLoggedIn,
		};
	} else {
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

		return {
			isLoggedIn,
			user,
		};
	}
};

export default function Index() {
	const { isLoggedIn, user } = useLoaderData<LoaderData>();

	return (
		<div>
			{isLoggedIn ? (
				<>
					<Form action="/auth/logout" method="post">
						<button className="contrast outline">logout</button>
					</Form>
					<div>{user?.id}</div>
					<div>{user?.username}</div>
					<div>{user?.createdAt}</div>
					<img
						src={`https://cdn.discordapp.com/avatars/${user?.id}/${user?.profilePicture}.png`}
						alt=""
					/>
				</>
			) : (
				<Form action="/auth/discord" method="post">
					<button className="contrast outline">login</button>
				</Form>
			)}

			<h1 className="font-bold text-xl">Notes</h1>

			{user?.notes?.map((note) => {
				return (
					<div key={note.id}>
						<h3 className="text-lg text-gray-700">{note.title}</h3>
						<div dangerouslySetInnerHTML={{ __html: note.content }} />
						{note.tags?.map((tag) => {
							return (
								<div key={tag.id}>
									<span
										style={{
											backgroundColor: `#${tag.color}`,
										}}
									>
										{tag.name}
									</span>
								</div>
							);
						})}
					</div>
				);
			})}
		</div>
	);
}
