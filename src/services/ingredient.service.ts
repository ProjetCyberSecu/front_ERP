import Cookies from "js-cookie";
import {APiResponse, FrisbeeIngredient, FrisbeeIngredientFromApi} from "../Types";
import {VITE_FRISBEE_API_HOST} from "../env";
import FrisbeeIngredients from "../components/Frisbee/FrisbeeIngredients";
import frisbeeIngredients from "../components/Frisbee/FrisbeeIngredients";

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

export const getIngredientsByFrisbeeId = async (frisbeeId: number): Promise<FrisbeeIngredient[]> => {
    const result = await fetch(`${VITE_FRISBEE_API_HOST}/frisbees/${frisbeeId}/ingredients`, {
        headers: {
            'authorization': `Bearer ${Cookies.get('accessToken')}`,
            'Content-Type': 'application/json'
        }
    })

    if (result.ok) {
        const parsedResult = await result.json() as APiResponse<FrisbeeIngredientFromApi[]>
        return parsedResult.response.map((e): FrisbeeIngredient => {return {...e, frisbeeId}})
    } else if (result.status === 401) {
        throw new Error('Vous n\' etes pas authorisé a recuperer les ingredients')
    } else {
        throw new Error('Une erreur est survenue')
    }
}

export const deleteIngredientsFrisbee = async (frisbeeId: string | number, ingredientId: string | number) => {
    const result = await fetch(`${VITE_FRISBEE_API_HOST}/frisbees/${frisbeeId}/ingredients/${ingredientId}`, {
        method: 'DELETE',
        headers: {
            'authorization': `Bearer ${Cookies.get('accessToken')}`,
            'Content-Type': 'application/json'
        }
    })

    if (!result.ok) {
        if (result.status === 401) {
            throw new Error('Vous n\' etes pas authorisé a modifier ce processus')
        } else {
            throw new Error('Une erreur est survenue')
        }
    }
}

export const addIngredientToFrisbee = async (frisbeeId: number, ingredientId: number, quantity: number): Promise<void> => {
    const result = await fetch(`${VITE_FRISBEE_API_HOST}/frisbees/${frisbeeId}/ingredients/${ingredientId}`, {
        method: 'POST',
        headers: {
            'authorization': `Bearer ${Cookies.get('accessToken')}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({quantity})
    })

    if (!result.ok) {
        if (result.status === 401) {
            throw new Error('Vous n\' etes pas authorisé a modifier ce processus')
        } else {
            throw new Error('Une erreur est survenue')
        }
    }
}

