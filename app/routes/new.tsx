import type { UseFloatingReturn } from "@floating-ui/react-dom";
import { autoUpdate, offset, shift, useFloating } from "@floating-ui/react-dom";
import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { useReducer, useState } from "react";
import { ClientOnly } from "remix-utils";
import { authenticator } from "~/utils/auth.server";
import { db } from "~/utils/db.server";
import { getBgColor, getColor, getContrast } from "~/utils/utils";

import type { Variants } from "framer-motion";
import { AnimatePresence, motion } from "framer-motion";
import QuillCss from "quill/dist/quill.snow.css";
import Header from "~/components/header";
import Quill from "~/components/quill.client";
import SidebarLayout from "~/components/sidebarLayout";
import CustomQuillCss from "../components/quill.css";

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
	const [creatingNewTag, toggleCreatingNewTag] = useReducer(
		(prev) => !prev,
		false
	);

	const floatingReturn = useFloating({
		placement: "top",
		whileElementsMounted: autoUpdate,
		middleware: [shift(), offset(12)],
	});

	return (
		<>
			<Header />
			<main className="relative mx-gutter pt-4 pb-16">
				<SidebarLayout>
					<Form
						className="flex flex-col gap-4 items-start mb-12"
						action="/actions/createNote"
						method="post"
					>
						<h1 className="text-5xl font-bold mb-6">Create New Note</h1>
						<input type="hidden" name="redirectTo" value="/" />
						<label htmlFor="noteTitle">Name</label>
						<input
							className="border border-gray-400 rounded-md py-1 px-2 w-64"
							type="text"
							name="noteTitle"
							id="noteTitle"
							maxLength={150}
						/>
						<ClientOnly
							fallback={<div style={{ width: 500, height: 300 }}></div>}
						>
							{() => <Quill defaultValue="Hello <b>Remix!</b>" />}
						</ClientOnly>
						<label htmlFor="tags">Tags</label>
						<div className="flex gap-2 flex-wrap">
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
							<button
								type="button"
								onClick={toggleCreatingNewTag}
								className="underline text-blue-600"
								ref={floatingReturn.reference}
							>
								Add another
							</button>
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
					<AnimatePresence>
						{creatingNewTag && (
							<CreateNewTag
								floatingReturn={floatingReturn}
								toggleOpen={toggleCreatingNewTag}
							/>
						)}
					</AnimatePresence>
				</SidebarLayout>
			</main>
		</>
	);
}

function CreateNewTag({
	floatingReturn,
	toggleOpen,
}: {
	floatingReturn: UseFloatingReturn;
	toggleOpen: () => void;
}) {
	const { x, y, floating, strategy } = floatingReturn;
	const [colorHue, setColorHue] = useState(0);

	const dialogVariants: Variants = {
		hidden: { scale: 0.5, opacity: 0 },
		visible: { scale: 1, opacity: 1 },
	};

	return (
		<motion.div
			ref={floating}
			style={{
				position: strategy,
				top: y ?? 0,
				left: x ?? 0,
				transformOrigin: "bottom",
			}}
			variants={dialogVariants}
			initial="hidden"
			animate="visible"
			exit="hidden"
			transition={{ type: "spring", bounce: 0, duration: 0.25 }}
		>
			<motion.div
				className="relative flex justify-center rounded-lg drop-shadow-md p-4 bg-paper"
				initial={{ backgroundColor: getBgColor(colorHue) }}
				animate={{
					backgroundColor: getBgColor(colorHue),
				}}
			>
				<Form
					className="flex flex-col gap-4 items-center text-center"
					action="/actions/createTag"
					method="post"
				>
					<h2 className="text-lg font-bold">Create New Tag</h2>
					<input type="hidden" name="redirectTo" value="/new" required />
					<div className="flex flex-col gap-2">
						<label htmlFor="">Tag Name</label>
						<input
							className="border border-gray-400 rounded-md py-1 px-2 w-64"
							type="text"
							name="tagName"
							required
							minLength={1}
							maxLength={40}
						/>
					</div>
					<div className="flex flex-col gap-2">
						<label htmlFor="tagColor">Color</label>
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
					<motion.button
						className="bg-paper px-6 py-2 rounded-full shadow-sm"
						initial={{
							backgroundColor: getColor(colorHue),
							color: getContrast(colorHue),
						}}
						animate={{
							backgroundColor: getColor(colorHue),
							color: getContrast(colorHue),
						}}
						type="submit"
						onClick={toggleOpen}
					>
						Create Tag
					</motion.button>
				</Form>
				<motion.div
					initial={{ backgroundColor: getBgColor(colorHue) }}
					animate={{
						backgroundColor: getBgColor(colorHue),
					}}
					className="absolute top-full h-4 w-4 bg-paper"
					style={{
						clipPath: "polygon(0 0, 50% 100%, 100% 0)",
					}}
				/>
			</motion.div>
		</motion.div>
	);
}
