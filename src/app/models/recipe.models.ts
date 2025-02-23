export interface Ingredients {
  id: string;
  ingredient?: string;
  quantity?: string;
  observations?: string;
  ingredient_id?:string
}

export interface Recipe {
  recipe_id?: number;
  title: string;
  image_url: string;
  username: string | null;
  author: string | null;
  description: string | null;
  ingredients: Ingredients[] | null;
  category: number;
  preparation: string | null
}

export interface CategoryModel {
  id: number;
  name: string;
  severity:
    | 'success'
    | 'secondary'
    | 'info'
    | 'warning'
    | 'danger'
    | 'contrast';
}

export interface RecipeFilter {
  author?: string | null;
  category?: number | null;
  title?: string | null;
}
