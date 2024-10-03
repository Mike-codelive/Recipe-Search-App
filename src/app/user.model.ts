export interface User {
  email: string;
  password: string;
  token: string;
}

export interface UserData {
  username: string;
  email: string;
  favoriteRecipes: Recipe[];
}

export interface Recipe {
  _id: string;
  title: string;
  ingredients: Ingredient[];
  instructions: string;
  user: string;
}

export interface Ingredient {
  name: string;
}
