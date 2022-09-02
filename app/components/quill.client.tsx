import QuillGlobal from "quill";
import type Delta from "quill-delta";
// @ts-ignore
import ImageCompress from "quill-image-compress";
import MagicUrl from "quill-magic-url";
import { useCallback, useEffect, useState } from "react";
import { useQuill } from "react-quilljs";

export default function Quill({ defaultValue }: { defaultValue?: string }) {
	const { quill, quillRef } = useQuill({
		modules: {
			imageCompress: {
				imageType: "image/webp", // default
			},
		},
	});

	if (QuillGlobal && !quill) {
		// For execute this line only once.
		QuillGlobal.register("modules/magicUrl", MagicUrl);
		QuillGlobal.register("modules/imageCompress", ImageCompress);
	}

	const [content, setContent] = useState<Delta | undefined>(undefined);

	const onChange = useCallback(() => {
		const currentContent = quill?.getContents() as Delta;
		setContent(currentContent);
	}, [quill]);

	useEffect(() => {
		if (!quill) return;

		if (defaultValue) {
			quill.clipboard.dangerouslyPasteHTML(defaultValue);
		}

		quill.on("selection-change", onChange);

		return () => {
			quill.off("selection-change", onChange);
		};
	}, [quill, defaultValue, onChange]);

	return (
		<div className="flex flex-col w-full max-w-4xl h-96">
			<div ref={quillRef} />
			<input type="hidden" name="noteContent" value={JSON.stringify(content)} />
		</div>
	);
}
