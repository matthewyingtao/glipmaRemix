import type Delta from "quill-delta";
import { useCallback, useEffect, useState } from "react";
import { useQuill } from "react-quilljs";

export default function Quill({ defaultValue }: { defaultValue?: string }) {
	const { quill, quillRef } = useQuill({});

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
