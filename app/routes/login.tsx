import { Form } from "@remix-run/react";

export default function Login() {
	return (
		<main className="grid place-items-center h-full w-full">
			<Form
				action="/auth/discord"
				method="post"
				className="px-6 py-12 rounded-2xl bg-white bg-paper text-center shadow-md border border-gray-400"
			>
				<div className="mb-20">
					<h1 className="text-5xl font-bold mb-6">glipma</h1>
					<p>Authenticate with Discord to get started.</p>
				</div>

				<button className="bg-purple-200 hover:bg-purple-300 transition-colors bg-paper px-6 py-2 rounded-full shadow-sm border border-gray-600">
					Login
				</button>
			</Form>
		</main>
	);
}
