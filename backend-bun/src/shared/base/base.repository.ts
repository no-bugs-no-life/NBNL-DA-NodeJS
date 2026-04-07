/**
 * Generic Base Repository Interface
 * Follows Dependency Inversion Principle
 */
export interface IBaseRepository<T> {
	findAll(): Promise<T[]>;
	findById(id: string): Promise<T | null>;
	create(data: Partial<T>): Promise<T>;
	update(id: string, data: Partial<T>): Promise<T | null>;
	delete(id: string): Promise<boolean>;
}

/**
 * Base Abstract Repository
 * Can be extended for specific DB implementations (Prisma, Drizzle, etc.)
 */
export abstract class BaseAbstractRepository<T> implements IBaseRepository<T> {
	abstract findAll(): Promise<T[]>;
	abstract findById(id: string): Promise<T | null>;
	abstract create(data: Partial<T>): Promise<T>;
	abstract update(id: string, data: Partial<T>): Promise<T | null>;
	abstract delete(id: string): Promise<boolean>;
}
