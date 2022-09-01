import type { UploadHandler } from "@remix-run/node";
import type { Readable } from "stream";

import { Base64Encode } from "base64-stream";
import getStream from "get-stream";

const streamToBase64 = async (stream: Readable): Promise<string> => {
	const b64 = new Base64Encode();
	const b64Stream = stream.pipe(b64);
	const b64String = await getStream(b64Stream);

	return b64String;
};

const apiUrl = "https://api.imgbb.com/1/upload";

export const uploadImage: UploadHandler = async ({
	name,
	stream,
	filename,
}) => {
	if (name !== "image" || !filename) {
		stream.resume();
		return;
	}

	const uploadedImage = await streamToBase64(stream);

	const body = new FormData();
	body.append("key", process.env.IMGBB_API_KEY!);
	body.append("image", uploadedImage);

	const response = await fetch(apiUrl, {
		method: "POST",
		headers: {
			Connection: "keep-alive",
		},
		body: body,
	});

	const json = await response.json();

	return json.data.url;
};
