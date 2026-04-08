export type SeedAnalytics = {
	appSlug: string;
	date: string; // YYYY-MM-DD
	views: number;
	downloads: number;
	installs: number;
	activeUsers: number;
	ratingAverage: number;
	crashCount: number;
	createdAt: Date;
	updatedAt: Date;
};

export const seedAnalytics: SeedAnalytics[] = [
	// Nimbus Notes (5 days)
	{ appSlug: "nimbus-notes", date: "2025-03-01", views: 420, downloads: 120, installs: 95, activeUsers: 70, ratingAverage: 4.6, crashCount: 1, createdAt: new Date("2025-03-01T00:00:00.000Z"), updatedAt: new Date("2025-03-01T00:00:00.000Z") },
	{ appSlug: "nimbus-notes", date: "2025-03-02", views: 460, downloads: 135, installs: 102, activeUsers: 78, ratingAverage: 4.6, crashCount: 0, createdAt: new Date("2025-03-02T00:00:00.000Z"), updatedAt: new Date("2025-03-02T00:00:00.000Z") },
	{ appSlug: "nimbus-notes", date: "2025-03-03", views: 510, downloads: 150, installs: 115, activeUsers: 85, ratingAverage: 4.7, crashCount: 2, createdAt: new Date("2025-03-03T00:00:00.000Z"), updatedAt: new Date("2025-03-03T00:00:00.000Z") },
	{ appSlug: "nimbus-notes", date: "2025-03-04", views: 495, downloads: 142, installs: 108, activeUsers: 82, ratingAverage: 4.7, crashCount: 1, createdAt: new Date("2025-03-04T00:00:00.000Z"), updatedAt: new Date("2025-03-04T00:00:00.000Z") },
	{ appSlug: "nimbus-notes", date: "2025-03-05", views: 530, downloads: 160, installs: 125, activeUsers: 90, ratingAverage: 4.7, crashCount: 0, createdAt: new Date("2025-03-05T00:00:00.000Z"), updatedAt: new Date("2025-03-05T00:00:00.000Z") },

	// Flashcards Việt (5 days)
	{ appSlug: "flashcards-viet", date: "2025-03-01", views: 380, downloads: 140, installs: 120, activeUsers: 95, ratingAverage: 4.8, crashCount: 0, createdAt: new Date("2025-03-01T00:00:00.000Z"), updatedAt: new Date("2025-03-01T00:00:00.000Z") },
	{ appSlug: "flashcards-viet", date: "2025-03-02", views: 410, downloads: 155, installs: 132, activeUsers: 102, ratingAverage: 4.8, crashCount: 1, createdAt: new Date("2025-03-02T00:00:00.000Z"), updatedAt: new Date("2025-03-02T00:00:00.000Z") },
	{ appSlug: "flashcards-viet", date: "2025-03-03", views: 450, downloads: 170, installs: 145, activeUsers: 110, ratingAverage: 4.8, crashCount: 0, createdAt: new Date("2025-03-03T00:00:00.000Z"), updatedAt: new Date("2025-03-03T00:00:00.000Z") },
	{ appSlug: "flashcards-viet", date: "2025-03-04", views: 430, downloads: 165, installs: 140, activeUsers: 108, ratingAverage: 4.7, crashCount: 0, createdAt: new Date("2025-03-04T00:00:00.000Z"), updatedAt: new Date("2025-03-04T00:00:00.000Z") },
	{ appSlug: "flashcards-viet", date: "2025-03-05", views: 470, downloads: 180, installs: 152, activeUsers: 120, ratingAverage: 4.8, crashCount: 1, createdAt: new Date("2025-03-05T00:00:00.000Z"), updatedAt: new Date("2025-03-05T00:00:00.000Z") },

	// Panda PDF Tools (5 days)
	{ appSlug: "panda-pdf-tools", date: "2025-03-01", views: 260, downloads: 70, installs: 55, activeUsers: 40, ratingAverage: 4.3, crashCount: 0, createdAt: new Date("2025-03-01T00:00:00.000Z"), updatedAt: new Date("2025-03-01T00:00:00.000Z") },
	{ appSlug: "panda-pdf-tools", date: "2025-03-02", views: 275, downloads: 75, installs: 58, activeUsers: 42, ratingAverage: 4.3, crashCount: 0, createdAt: new Date("2025-03-02T00:00:00.000Z"), updatedAt: new Date("2025-03-02T00:00:00.000Z") },
	{ appSlug: "panda-pdf-tools", date: "2025-03-03", views: 290, downloads: 82, installs: 62, activeUsers: 45, ratingAverage: 4.4, crashCount: 1, createdAt: new Date("2025-03-03T00:00:00.000Z"), updatedAt: new Date("2025-03-03T00:00:00.000Z") },
	{ appSlug: "panda-pdf-tools", date: "2025-03-04", views: 305, downloads: 88, installs: 66, activeUsers: 48, ratingAverage: 4.4, crashCount: 0, createdAt: new Date("2025-03-04T00:00:00.000Z"), updatedAt: new Date("2025-03-04T00:00:00.000Z") },
	{ appSlug: "panda-pdf-tools", date: "2025-03-05", views: 320, downloads: 95, installs: 70, activeUsers: 50, ratingAverage: 4.4, crashCount: 0, createdAt: new Date("2025-03-05T00:00:00.000Z"), updatedAt: new Date("2025-03-05T00:00:00.000Z") },
];

