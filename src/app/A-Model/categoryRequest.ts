export interface CategoryRequest {
  name: string;
  description: string;
  parentCategoryId?: number;
}