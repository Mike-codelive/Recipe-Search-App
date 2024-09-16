export interface Recipe {
  id: number;
  title: string;
  image: string;
}

export interface ApiResponse {
  recipes: Recipe[];
}
