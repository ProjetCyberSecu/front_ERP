import Cookies from "js-cookie";
import {APiResponse} from "../Types";
import {VITE_FRISBEE_API_HOST} from "../env";

export type Ingredient = {
    id: number,
    name: string,
    description: string
}

export type EditableIngredient = Omit<Ingredient, 'id'>

export const getAllIngredient = async (): Promise<Ingredient[]> => {
    const result = await fetch(`${VITE_FRISBEE_API_HOST}/ingredients`, {
        headers: {
            'authorization': `Bearer ${Cookies.get('accessToken')}`
        }
    })

    if (result.ok) {
        const parsedResult = await result.json() as APiResponse<Ingredient[]>
        return parsedResult.response
    }
    return []
}

export const deleteOneIngredient = async (ingredientId: number): Promise<void> => {

    const result = await fetch(`${VITE_FRISBEE_API_HOST}/ingredients/${ingredientId}`, {
        method: 'DELETE',
        headers: {
            'authorization': `Bearer ${Cookies.get('accessToken')}`
        }
    })
    if (!result.ok) {
        if (result.status === 401) {
            throw new Error('Vous n\' etes pas authorisé a suprimer ce frisbee')
        } else {
            throw new Error('Une erreur est survenue')
        }
    }
}

export const createIngredient = async (ingredient: EditableIngredient): Promise<void> => {

    const result = await fetch(`${VITE_FRISBEE_API_HOST}/ingredients`, {
        method: 'POST',
        headers: {
            'authorization': `Bearer ${Cookies.get('accessToken')}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(ingredient)
    })
    if (!result.ok) {
        if (result.status === 401) {
            throw new Error('Vous n\' etes pas authorisé a creer un ingredient')
        } else {
            throw new Error('Une erreur est survenue')
        }
    }
}

export const editIngredientById = async (ingredientId: number, ingredient: EditableIngredient): Promise<void> => {

    const result = await fetch(`${VITE_FRISBEE_API_HOST}/ingredients/${ingredientId}`, {
        method: 'PATCH',
        headers: {
            'authorization': `Bearer ${Cookies.get('accessToken')}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(ingredient)
    })
    if (!result.ok) {
        if (result.status === 401) {
            throw new Error('Vous n\' etes pas authorisé a modifier ce processus')
        } else {
            throw new Error('Une erreur est survenue')
        }
    }
}