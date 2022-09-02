import QuillGlobal from "quill";
import type Delta from "quill-delta";
import { useCallback, useEffect, useState } from "react";
import { useQuill } from "react-quilljs";
// @ts-ignore
import ImageCompress from "quill-image-compress";
import MagicUrl from "quill-magic-url";

const toolbar = [
	["bold", "italic", "underline", { list: "bullet" }],
	[{ size: ["small", false, "large", "huge"] }],
	["image", "clean"],
];

export default function Quill({ defaultValue }: { defaultValue?: string }) {
	const { quill, quillRef } = useQuill({
		theme: "snow",
		modules: {
			toolbar,
			imageCompress: {
				imageType: "image/webp", // default
			},
		},
	});

	if (QuillGlobal && !quill) {
		QuillGlobal.register("modules/magicUrl", MagicUrl);
		QuillGlobal.register("modules/imageCompress", ImageCompress);
	}

	const [content, setContent] = useState<Delta | undefined>(undefined);

	const onChange = useCallback(() => {
		const currentContent = quill?.getContents() as Delta;
		setContent(currentContent);
	}, [quill]);

	useEffect(() => {
		if (!quill || !QuillGlobal) return;

		if (defaultValue) {
			quill.clipboard.dangerouslyPasteHTML(defaultValue);
		}

		quill.on("selection-change", onChange);

		return () => {
			quill.off("selection-change", onChange);
		};
	}, [quill, defaultValue, onChange]);

	return (
		<div className="flex flex-col w-full max-w-4xl h-96 bg-paper bg-white rounded-lg border">
			<div ref={quillRef} />
			<input type="hidden" name="noteContent" value={JSON.stringify(content)} />
		</div>
	);
}
