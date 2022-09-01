import type { User } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { authenticator } from "~/utils/auth.server";
import { db } from "~/utils/db.server";

type LoaderData = {
	isLoggedIn: boolean;
	user?: User | null;
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
			<Form action="/auth/discord" method="post">
				<button className="contrast outline">login</button>
			</Form>
			{isLoggedIn && (
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
			)}

			<h1>Welcome to Remix</h1>
			<ul>
				<li>
					<a
						target="_blank"
						href="https://remix.run/tutorials/blog"
						rel="noreferrer"
					>
						15m Quickstart Blog Tutorial
					</a>
				</li>
				<li>
					<a
						target="_blank"
						href="https://remix.run/tutorials/jokes"
						rel="noreferrer"
					>
						Deep Dive Jokes App Tutorial
					</a>
				</li>
				<li>
					<a target="_blank" href="https://remix.run/docs" rel="noreferrer">
						Remix Docs
					</a>
				</li>
			</ul>
		</div>
	);
}
