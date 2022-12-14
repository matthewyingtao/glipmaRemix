import type { User } from "@prisma/client";
import { Authenticator } from "remix-auth";
import type { DiscordProfile } from "remix-auth-socials";
import { DiscordStrategy } from "remix-auth-socials";
import { siteUrl } from "~/config";
import { storage } from "~/utils/session.server";
import { db } from "./db.server";

const getUser = async (id: string): Promise<User | null> =>
	await db.user.findUnique({
		where: { id },
	});

const createUser = async (profile: DiscordProfile): Promise<User> => {
	const user = await db.user.create({
		data: {
			id: profile.id,
			username: profile.name?.givenName || profile.displayName,
			profilePicture: profile.__json.avatar,
		},
	});
	return user;
};

export interface AuthUserData {
	userId: string;
	pfp: string;
}

export const authenticator = new Authenticator<AuthUserData>(storage);

authenticator.use(
	new DiscordStrategy(
		{
			clientID: process.env.DISCORD_CLIENT_ID || "",
			clientSecret: process.env.DISCORD_CLIENT_SECRET || "",
			callbackURL: `${siteUrl}/auth/discord/callback`,
		},
		async ({ profile }) => {
			const userExists = await getUser(profile.id);

			if (userExists !== null)
				return { userId: userExists.id, pfp: userExists.profilePicture || "" };

			const user = await createUser(profile);
			return { userId: user.id, pfp: user.profilePicture || "" };
		}
	)
);
