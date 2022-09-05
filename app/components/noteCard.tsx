import { Link } from "@remix-run/react";
import type { NoteWithTags } from "~/types";
import { getColor, getContrast } from "~/utils/utils";

export default function NoteCard({
	note: { content, id, title, tags },
}: {
	note: NoteWithTags;
}) {
	return (
		<div
			className="bg-paper bg-yellow-200 p-8 pt-0 rounded-2xl shadow-md"
			key={id}
		>
			<header className="flex flex-col gap-2 mb-4">
				<div className="flex flex-wrap gap-2">
					{tags?.map((tag) => {
						return (
							<Link
								className="whitespace-nowrap px-3 py-[2px] rounded-full -translate-y-[50%]"
								style={{
									backgroundColor: getColor(tag.hue),
									color: getContrast(tag.hue),
								}}
								to={`/tag/${tag.name}`}
								key={tag.id}
							>
								{tag.name}
							</Link>
						);
					})}
				</div>
				<h3 className="text-lg flex-shrink-0 text-gray-700 font-bold">
					{title}
				</h3>
			</header>
			<div dangerouslySetInnerHTML={{ __html: content }} />
		</div>
	);
}
