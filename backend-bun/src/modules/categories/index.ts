// Public API - Barrel export
export { categoriesRouter } from "./categories.router";
export type {
	CategoryParams,
	CreateCategoryRequest,
	UpdateCategoryRequest,
} from "./categories.schema";
export { CategoriesService } from "./categories.service";
export type { CategoryPublic, ICategory } from "./categories.types";
