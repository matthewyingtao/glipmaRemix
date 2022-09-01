import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { authenticator } from "~/utils/auth.server";

export const loader: LoaderFunction = () => redirect("/");

export const action: ActionFunction = ({ request }) => {
	return authenticator.authenticate("discord", request);
};
