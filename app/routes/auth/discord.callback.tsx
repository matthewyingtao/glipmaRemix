import type { LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { authenticator } from "~/utils/auth.server";

export const loader: LoaderFunction = ({ request }) => {
	const url = new URL(request.url);

	// if the url '/auth/discord/callback' is accessed directly
	if (url.searchParams.entries().next().done) {
		return redirect("/login");
	}

	// if the discord auth is cancelled or fails
	const error = url.searchParams.get("error");
	if (error) {
		return redirect("/login");
	}

	try {
		return authenticator.authenticate("discord", request, {
			successRedirect: "/",
			failureRedirect: "/login",
		});
	} catch (error) {
		return redirect("/login");
	}
};
