import type { Collection, Db, Document, OptionalUnlessRequiredId } from "mongodb";

export function requireDb(db: Db | undefined | null): Db {
	if (!db) throw new Error("Database not connected");
	return db;
}

export function normalizeSlug(value: string) {
	return String(value || "")
		.trim()
		.toLowerCase()
		.replace(/\s+/g, "-")
		.replace(/[^a-z0-9-]/g, "");
}

export async function upsertManyByKey<T extends Document>(opts: {
	collection: Collection<T>;
	items: Array<{ key: string; doc: OptionalUnlessRequiredId<T> }>;
	keyField: keyof T & string;
	setOnInsert?: boolean;
}) {
	const { collection, items, keyField, setOnInsert = true } = opts;
	if (items.length === 0) return;

	const now = new Date();

	const ops = items.map(({ key, doc }) => {
		const d = doc as Record<string, unknown>;
		// Keep createdAt stable once inserted; avoid changing key field by accident.
		const { _id: _ignoredId, createdAt: _ignoredCreatedAt, ...rest } = d;
		const { [keyField]: _ignoredKeyField, ...restWithoutKey } = rest;
		const $set = {
			...restWithoutKey,
			updatedAt: d.updatedAt ?? now,
		} as unknown as Partial<T>;

		const update = setOnInsert
			? { $setOnInsert: { createdAt: d.createdAt ?? now }, $set }
			: { $set };

		return {
			updateOne: {
				filter: { [keyField]: key } as unknown as Partial<T>,
				update,
				upsert: true,
			},
		};
	});

	await collection.bulkWrite(ops, { ordered: false });
}

export async function upsertMany<T extends Document>(opts: {
	collection: Collection<T>;
	items: Array<{
		filter: Partial<T>;
		insert: OptionalUnlessRequiredId<T>;
		set?: Partial<T>;
	}>;
}) {
	const { collection, items } = opts;
	if (items.length === 0) return;
	const now = new Date();

	const ops = items.map(({ filter, insert, set }) => {
		const insertDoc = insert as Record<string, unknown>;
		const setDoc = (set || {}) as Record<string, unknown>;
		const { _id: _ignoredId, createdAt: _ignoredCreatedAt, ...restInsert } =
			insertDoc;

		return {
			updateOne: {
				filter: filter as unknown as Partial<T>,
				update: {
					$setOnInsert: { createdAt: insertDoc.createdAt ?? now },
					$set: {
						...restInsert,
						...setDoc,
						updatedAt: setDoc.updatedAt ?? insertDoc.updatedAt ?? now,
					},
				},
				upsert: true,
			},
		};
	});

	await collection.bulkWrite(ops, { ordered: false });
}

export async function findManyByField<T extends Document>(opts: {
	collection: Collection<T>;
	field: keyof T & string;
	values: string[];
}) {
	const { collection, field, values } = opts;
	if (values.length === 0) return [];
	return (await collection
		.find({ [field]: { $in: values } } as unknown as Partial<T>)
		.toArray()) as unknown as T[];
}

export function ensureMin<T>(items: T[], min: number, name: string) {
	if (items.length < min) {
		throw new Error(`${name} must have at least ${min} items, got ${items.length}`);
	}
}

