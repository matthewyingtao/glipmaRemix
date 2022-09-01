import type { LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { authenticator } from "~/utils/auth.server";
import { db } from "~/utils/db.server";

type LoaderData = {
	tags: {
		id: number;
		name: string;
		color: string;
	}[];
};

export const loader: LoaderFunction = async ({ request }) => {
	const userId = await authenticator.isAuthenticated(request);
	const isLoggedIn = userId !== null;

	if (!isLoggedIn) return redirect("/");

	const tags = await db.tag.findMany({
		where: {
			userId,
		},
	});

	console.log(tags);

	return {
		tags: tags.map((tag) => ({ id: tag.id, name: tag.name, color: tag.color })),
	};
};

export default function Submit() {
	const { tags } = useLoaderData<LoaderData>();

	return (
		<div>
			<h1>Submit</h1>
			{tags.map((tag) => (
				<div key={tag.id}>
					<p className="text-red-400">{tag.name}</p>
					<p className="text-red-600">{tag.color}</p>
				</div>
			))}

			<Form action="/actions/createTag" method="post">
				<input type="hidden" name="redirectTo" value="/submit" />

				<label htmlFor="">Name</label>
				<input type="text" name="tagName" />
				<label htmlFor="">Color</label>
				<input type="text" name="tagColor" />

				<button type="submit">Submit Data</button>
			</Form>
		</div>
	);
}
