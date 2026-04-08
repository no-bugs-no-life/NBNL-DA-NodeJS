export const SEED_MIN_PER_COLLECTION = 15;

// Fixed timestamps make seed deterministic and "non-random".
export const SEED_EPOCH = new Date("2025-01-15T09:00:00.000Z");

export function daysAfter(epoch: Date, days: number) {
	const d = new Date(epoch);
	d.setUTCDate(d.getUTCDate() + days);
	return d;
}

