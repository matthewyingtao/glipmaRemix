import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";
import { authenticator } from "~/utils/auth.server";
import { db } from "~/utils/db.server";

import createDOMPurify from "dompurify";
import { JSDOM } from "jsdom";

export const loader: LoaderFunction = () => redirect("/");

export const action: ActionFunction = async ({ request }) => {
	const { userId } = (await authenticator.isAuthenticated(request)) || {};
	const isLoggedIn = userId !== undefined;

	if (!isLoggedIn) return redirect("/");

	const bodyParams = await request.formData();

	// TODO: stricter typechecking for invalid requests
	const noteTitle = bodyParams.get("noteTitle") as string;
	const isPublic = bodyParams.get("isPublic") === "on";
	const isTodo = bodyParams.get("isTodo") === "on";
	const noteContent = JSON.parse(bodyParams.get("noteContent") as string);
	// convert and sanitize content into html
	const converter = new QuillDeltaToHtmlConverter(noteContent.ops);
	const window = new JSDOM("").window as any;
	const DOMPurify = createDOMPurify(window);
	const dirty = converter.convert();
	const clean = DOMPurify.sanitize(dirty, {
		USE_PROFILES: { html: true },
	});

	const tags = [...bodyParams.keys()].filter(
		(v) =>
			![
				"redirectTo",
				"noteTitle",
				"noteContent",
				"isPublic",
				"isTodo",
			].includes(v.toString())
	);

	await db.note.create({
		data: {
			userId,
			tags: {
				connect: tags.map((tag) => ({ id: parseInt(tag) })),
			},
			title: noteTitle,
			content: clean,
			isPublic,
			isTodo,
		},
	});

	const redirectTo = bodyParams.get("redirectTo") as string;

	return redirect(redirectTo || "/");
};
