import { SEED_EPOCH, daysAfter } from "./seedConfig";

export type SeedWishlist = {
	userEmail: string;
	appSlugs: string[];
	createdAt: Date;
	updatedAt: Date;
};

export const seedWishlists: SeedWishlist[] = [
	{ userEmail: "vy.pham@nbnl.com", appSlugs: ["nimbus-notes", "flashcards-viet", "sunrise-habit"], createdAt: daysAfter(SEED_EPOCH, 70), updatedAt: daysAfter(SEED_EPOCH, 70) },
	{ userEmail: "khoa.vo@nbnl.com", appSlugs: ["panda-pdf-tools", "vaultkey-passwords"], createdAt: daysAfter(SEED_EPOCH, 71), updatedAt: daysAfter(SEED_EPOCH, 71) },
	{ userEmail: "thao.ngo@nbnl.com", appSlugs: ["flashcards-viet", "lotuslab-dictionary"], createdAt: daysAfter(SEED_EPOCH, 72), updatedAt: daysAfter(SEED_EPOCH, 72) },
	{ userEmail: "huy.dao@nbnl.com", appSlugs: ["paperplane-tasks", "nimbus-notes"], createdAt: daysAfter(SEED_EPOCH, 73), updatedAt: daysAfter(SEED_EPOCH, 73) },
	{ userEmail: "mai.nguyen@nbnl.com", appSlugs: ["mintpixel-photo", "puzzle-bento"], createdAt: daysAfter(SEED_EPOCH, 74), updatedAt: daysAfter(SEED_EPOCH, 74) },
	{ userEmail: "son.pham@nbnl.com", appSlugs: ["panda-pdf-tools", "coconut-budget"], createdAt: daysAfter(SEED_EPOCH, 75), updatedAt: daysAfter(SEED_EPOCH, 75) },
	{ userEmail: "user.quyen@nbnl.com", appSlugs: ["sunrise-habit", "family-calendar"], createdAt: daysAfter(SEED_EPOCH, 76), updatedAt: daysAfter(SEED_EPOCH, 76) },
	{ userEmail: "user.duy@nbnl.com", appSlugs: ["vaultkey-passwords", "travelpocket"], createdAt: daysAfter(SEED_EPOCH, 77), updatedAt: daysAfter(SEED_EPOCH, 77) },
	{ userEmail: "user.anh@nbnl.com", appSlugs: ["flashcards-viet", "nimbus-notes", "paperplane-tasks"], createdAt: daysAfter(SEED_EPOCH, 78), updatedAt: daysAfter(SEED_EPOCH, 78) },
	{ userEmail: "google.user01@nbnl.com", appSlugs: ["banana-run", "puzzle-bento", "mintpixel-photo"], createdAt: daysAfter(SEED_EPOCH, 79), updatedAt: daysAfter(SEED_EPOCH, 79) },
	{ userEmail: "google.user02@nbnl.com", appSlugs: ["lotuslab-dictionary", "coconut-budget"], createdAt: daysAfter(SEED_EPOCH, 80), updatedAt: daysAfter(SEED_EPOCH, 80) },
	{ userEmail: "admin@nbnl.com", appSlugs: ["vaultkey-passwords", "panda-pdf-tools"], createdAt: daysAfter(SEED_EPOCH, 81), updatedAt: daysAfter(SEED_EPOCH, 81) },
	{ userEmail: "moderator@nbnl.com", appSlugs: ["flashcards-viet", "nimbus-notes"], createdAt: daysAfter(SEED_EPOCH, 82), updatedAt: daysAfter(SEED_EPOCH, 82) },
	{ userEmail: "devstudio@nbnl.com", appSlugs: ["nimbus-notes", "paperplane-tasks"], createdAt: daysAfter(SEED_EPOCH, 83), updatedAt: daysAfter(SEED_EPOCH, 83) },
	{ userEmail: "tuan.nguyen@nbnl.com", appSlugs: ["flashcards-viet", "lotuslab-dictionary"], createdAt: daysAfter(SEED_EPOCH, 84), updatedAt: daysAfter(SEED_EPOCH, 84) },
];

