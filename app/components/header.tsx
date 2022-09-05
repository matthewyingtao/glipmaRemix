import { Form, Link } from "@remix-run/react";
import { IoLogOutOutline, IoSearchOutline } from "react-icons/io5";

export default function Header() {
	return (
		<header className="flex justify-between mx-gutter py-8 items-center">
			<Link to="/" prefetch="intent">
				<h1 className="text-xl">glipma</h1>
			</Link>

			<div className="flex gap-4">
				<Form action="/search" method="get" className="relative flex">
					<label htmlFor="q" className="sr-only">
						Search
					</label>
					<input
						type="search"
						id="q"
						name="q"
						className="px-4 py-2 w-full text-gray-900 bg-white rounded-l-lg"
						placeholder="Search Notes"
					/>
					<button
						type="submit"
						className="rounded-r-lg px-4 py-2 bg-blue-200 hover:bg-blue-300 transition-colors"
					>
						<IoSearchOutline className="w-5 h-5" />
					</button>
				</Form>
				<Form action="/auth/logout" method="post" className="flex">
					<button type="submit" aria-label="logout">
						<IoLogOutOutline className="h-12 w-12 p-2 pr-0 bg-purple-200 hover:bg-purple-300 transition-colors rounded-full" />
					</button>
				</Form>
			</div>
		</header>
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
