import type { Note, Tag, User } from "@prisma/client";

export type NoteWithTags = Note & {
	tags: Tag[];
};

export type UserWithNotes = User & {
	notes: NoteWithTags[];
};
