// Public API - Barrel export
export { categoriesRouter } from "./categories.router";
export { CategoriesService } from "./categories.service";
export type { ICategory, CategoryPublic } from "./categories.types";
export type {
	CreateCategoryRequest,
	UpdateCategoryRequest,
	CategoryParams,
} from "./categories.schema";
