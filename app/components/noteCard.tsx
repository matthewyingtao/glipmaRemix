import type { NoteWithTags } from "~/types";
import { getColor, getContrast } from "~/utils/utils";

export default function NoteCard({
	note: { content, id, title, tags },
}: {
	note: NoteWithTags;
}) {
	return (
		<div className="bg-paper bg-yellow-200 p-8 rounded-2xl shadow-md" key={id}>
			<div className="flex gap-4 items-center mb-4 justify-between">
				<h3 className="text-lg text-gray-700 font-bold">{title}</h3>
				<div className="flex gap-2">
					{tags?.map((tag) => {
						return (
							<div key={tag.id}>
								<span
									className="flex justify-center items-center px-3 py-[2px] rounded-full"
									style={{
										backgroundColor: getColor(tag.hue),
										color: getContrast(tag.hue),
									}}
								>
									{tag.name}
								</span>
							</div>
						);
					})}
				</div>
			</div>
			<div dangerouslySetInnerHTML={{ __html: content }} />
		</div>
	);
}
