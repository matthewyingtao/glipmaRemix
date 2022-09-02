import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import QuillCss from "quill/dist/quill.snow.css";
import { useState } from "react";
import { ClientOnly } from "remix-utils";
import CustomQuillCss from "../components/quill.css";

import Header from "~/components/header";
import Quill from "~/components/quill.client";
import { authenticator } from "~/utils/auth.server";
import { db } from "~/utils/db.server";
import { getColor, getContrast } from "~/utils/utils";

export const links: LinksFunction = () => [
	{ rel: "stylesheet", href: QuillCss },
	{ rel: "stylesheet", href: CustomQuillCss },
];

type LoaderData = {
	tags: {
		id: number;
		name: string;
		hue: number;
	}[];
};

export const loader: LoaderFunction = async ({ request }) => {
	const userId = await authenticator.isAuthenticated(request);
	const isLoggedIn = userId !== null;

	if (!isLoggedIn) return redirect("/login");

	const tags = await db.tag.findMany({
		where: {
			userId,
		},
	});

	return {
		tags: tags.map((tag) => ({ id: tag.id, name: tag.name, hue: tag.hue })),
	};
};

export default function Submit() {
	const { tags } = useLoaderData<LoaderData>();
	const [colorHue, setColorHue] = useState(0);

	return (
		<>
			<Header />
			<main className="mx-gutter py-8">
				<h1 className="text-5xl font-bold mb-12">Submit</h1>
				<Form
					className="flex flex-col gap-4 items-start mb-12"
					action="/actions/createTag"
					method="post"
				>
					<h2 className="text-lg font-bold">Create New Tag</h2>
					<input type="hidden" name="redirectTo" value="/submit" required />
					<div className="flex flex-col gap-2">
						<label htmlFor="">Tag Name</label>
						<input
							className="border rounded-md py-1 px-2 w-64"
							type="text"
							name="tagName"
						/>
					</div>
					<div className="flex flex-col gap-2">
						<label htmlFor="">Color</label>
						<div className="grid grid-cols-6 gap-2 mb-2">
							{
								// 0 - 360 in 20 degree increments
								[...Array(18).keys()].map((val) => {
									const hue = val * 20;
									return (
										<button
											key={hue}
											className={`h-8 w-8 rounded-md border transition-all ${
												hue === colorHue
													? "border-black shadow-lg scale-110"
													: "border-gray-500 opacity-60 scale-90"
											}`}
											style={{ backgroundColor: getColor(hue) }}
											onClick={() => setColorHue(hue)}
											type="button"
										/>
									);
								})
							}
						</div>
					</div>
					<input type="hidden" name="tagColor" value={colorHue} />
					<button
						className="bg-blue-200 hover:bg-blue-300 transition-colors bg-paper px-6 py-2 rounded-full shadow-sm"
						type="submit"
					>
						Create Tag
					</button>
				</Form>
				<Form
					className="flex flex-col gap-4 items-start mb-12"
					action="/actions/createNote"
					method="post"
				>
					<h2 className="text-lg font-bold mb-4">Create New Note</h2>
					<input type="hidden" name="redirectTo" value="/" />
					<label htmlFor="noteTitle">Name</label>
					<input
						className="border rounded-md py-1 px-2 w-64"
						type="text"
						name="noteTitle"
						id="noteTitle"
					/>
					<ClientOnly
						fallback={<div style={{ width: 500, height: 300 }}></div>}
					>
						{() => <Quill defaultValue="Hello <b>Remix!</b>" />}
					</ClientOnly>
					<label htmlFor="tags">Tags</label>
					<div className="flex gap-2">
						{tags.map((tag) => {
							const id = tag.id.toString();
							return (
								<label
									htmlFor={id}
									className="flex gap-2 px-2 py-[2px] rounded-full cursor-pointer"
									style={{
										backgroundColor: getColor(tag.hue),
										color: getContrast(tag.hue),
									}}
									key={id}
								>
									<input type="checkbox" name={id} id={id} />
									<span>{tag.name}</span>
								</label>
							);
						})}
					</div>
					<div className="flex gap-6">
						<div className="flex gap-2">
							<input type="checkbox" name="isPublic" id="isPublic" />
							<label htmlFor="isPublic">Public</label>
						</div>
						<div className="flex gap-2">
							<input type="checkbox" name="isTodo" id="isTodo" />
							<label htmlFor="isTodo">Todo</label>
						</div>
					</div>
					<button
						className="bg-blue-200 hover:bg-blue-300 transition-colors bg-paper px-6 py-2 rounded-full shadow-sm"
						type="submit"
					>
						Create Note
					</button>
				</Form>
			</main>
		</>
	);
}
