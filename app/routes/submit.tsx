import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { authenticator } from "~/utils/auth.server";
import { db } from "~/utils/db.server";

import quillCss from "quill/dist/quill.snow.css";
import { ClientOnly } from "remix-utils";
import Quill from "~/components/quill.client";

export const links: LinksFunction = () => [
	{ rel: "stylesheet", href: quillCss },
];

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

	return {
		tags: tags.map((tag) => ({ id: tag.id, name: tag.name, color: tag.color })),
	};
};

export default function Submit() {
	const { tags } = useLoaderData<LoaderData>();

	return (
		<div>
			<h1>Submit</h1>

			<Form
				className="flex flex-col items-start"
				action="/actions/createTag"
				method="post"
			>
				Create New Tag
				<input type="hidden" name="redirectTo" value="/submit" />
				<label htmlFor="">Name</label>
				<input className="border" type="text" name="tagName" />
				<label htmlFor="">Color</label>
				<input className="border" type="text" name="tagColor" />
				<button className="border" type="submit">
					Submit Data
				</button>
			</Form>

			<Form
				className="flex flex-col items-start"
				action="/actions/createNote"
				method="post"
			>
				<h3>Create New Note</h3>
				<input type="hidden" name="redirectTo" value="/" />

				<label htmlFor="noteTitle">Name</label>
				<input className="border" type="text" name="noteTitle" id="noteTitle" />
				<ClientOnly fallback={<div style={{ width: 500, height: 300 }}></div>}>
					{() => <Quill defaultValue="Hello <b>Remix!</b>" />}
				</ClientOnly>
				<label htmlFor="tags">Tags</label>
				{tags.map((tag) => {
					const id = tag.id.toString();
					return (
						<div key={id}>
							<input type="checkbox" name={id} id={id} />
							<label htmlFor={id}>{tag.name}</label>
						</div>
					);
				})}

				<label htmlFor="isPublic">Public</label>
				<input type="checkbox" name="isPublic" id="isPublic" />

				<label htmlFor="isTodo">Todo</label>
				<input type="checkbox" name="isTodo" id="isTodo" />

				<button className="border" type="submit">
					Submit Data
				</button>
			</Form>
		</div>
	);
}
