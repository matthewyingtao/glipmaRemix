import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { authenticator } from "~/utils/auth.server";
import { db } from "~/utils/db.server";

export const loader: LoaderFunction = () => redirect("/");

export const action: ActionFunction = async ({ request }) => {
	const { userId } = (await authenticator.isAuthenticated(request)) || {};
	const isLoggedIn = userId !== undefined;

	if (!isLoggedIn) return redirect("/");

	const bodyParams = await request.formData();

	// TODO: stricter typechecking for invalid requests
	const tagName = bodyParams.get("tagName") as string;
	const tagColor = bodyParams.get("tagColor") as string;

	await db.tag.create({
		data: {
			name: tagName,
			hue: parseInt(tagColor),
			userId: userId,
		},
	});

	const redirectTo = bodyParams.get("redirectTo") as string;

	return redirect(redirectTo || "/");
};
