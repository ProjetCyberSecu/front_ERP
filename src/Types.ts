import {Frisbee} from "./services/frisbee.service";
import {Ingredient} from "./services/ingredient.service";

export type APiResponse<T> = {status: number, response: T}
export type FrisbeeIngredient = {
    frisbeeId: number
    id: number
    ingredient: Ingredient
    quantity: number
}
export type FrisbeeIngredientFromApi = Omit<FrisbeeIngredient, 'frisbeeId'>
