export interface Ingredients {
    id: string;
    ingredient?: string;
    quantity?: string;
    observations?: string;
}

export interface Recipe {
    title: string;
    image_url: string;
    username: string | null;
    category: number;
  }
  