import { Form, Link } from "@remix-run/react";

export default function Header() {
	return (
		<div className="flex justify-between mx-gutter my-8 py-4 px-8 bg-paper bg-white shadow-md rounded-full">
			<Link to="/">
				<h1>glipma</h1>
			</Link>

			<Form action="/auth/logout" method="post">
				<button>logout</button>
			</Form>
		</div>
	);
}

// eslint-disable-next-line no-lone-blocks
{
	/* <div>
	<div>{user?.id}</div>
	<div>{user?.username}</div>
	<div>{user?.createdAt}</div>
	<img
		src={`https://cdn.discordapp.com/avatars/${user?.id}/${user?.profilePicture}.png`}
		alt=""
	/>
</div>; */
}
