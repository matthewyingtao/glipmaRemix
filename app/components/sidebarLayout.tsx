import { Link } from "@remix-run/react";
import { FiSend } from "react-icons/fi";
import { IoArchiveOutline, IoFolderOpenOutline } from "react-icons/io5";

export default function SidebarLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="grid md:grid-cols-[auto_1fr] gap-x-12 gap-y-24">
			<aside className="sticky top-12 flex flex-col gap-8 bg-paper bg-white rounded-2xl pl-6 pr-12 py-8 h-fit">
				<Link
					to="/"
					prefetch="intent"
					className="flex items-center gap-4 text-lg group"
				>
					<IoFolderOpenOutline className="h-8 w-8 group-hover:text-blue-500 transition-colors" />
					<span className="group-hover:translate-x-[2px] transition-transform">
						Notes
					</span>
				</Link>
				<Link
					to="/new"
					prefetch="intent"
					className="flex items-center gap-4 text-lg group"
				>
					<FiSend className="h-8 w-8 group-hover:text-blue-500 transition-colors" />
					<span className="group-hover:translate-x-[2px] transition-transform">
						Submit
					</span>
				</Link>
				<Link
					to="/"
					prefetch="intent"
					className="flex items-center gap-4 text-lg group"
				>
					<IoArchiveOutline className="h-8 w-8 group-hover:text-blue-500 transition-colors" />
					<span className="group-hover:translate-x-[2px] transition-transform">
						Archive
					</span>
				</Link>
			</aside>

			{children}
		</div>
	);
}
