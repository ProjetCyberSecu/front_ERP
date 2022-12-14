import Cookies from "js-cookie";
import {logout} from "./auth.service";
import {NavigateFunction} from "react-router-dom";
import {IAuthContext} from "../App";
import EditFrisbee from "../components/pages/EditFrisbee";
import {APiResponse} from "../Types";
import {VITE_FRISBEE_API_HOST} from "../env";

export type Frisbee = {
    "id": number,
    "name": string,
    "description": string,
    "price_wt": number,
    "range": string,
    "processId"?: number
}

/**
 * Function that fetch all Frisbees
 * @param navigate
 * @param authContext
 */
export const getAllFrisbee = async (navigate: NavigateFunction, authContext: IAuthContext): Promise<Frisbee[]> => {
    const result = await fetch(`${VITE_FRISBEE_API_HOST}/frisbees`, {
        headers: {
            'authorization': `Bearer ${Cookies.get('accessToken')}`
        }
    })

    if (result.ok) {
        const jsoned = await result.json()
        return jsoned.response
    } else if (result.status === 401) {
        logout(navigate, authContext)
        return []
    } else {
        throw new Error('Une erreur est survenue')
    }
}

export const getOneFrisbeeById = async (frisbeeId: number, navigate: NavigateFunction): Promise<Frisbee> => {

    const result = await fetch(`${VITE_FRISBEE_API_HOST}/frisbees/${frisbeeId}`, {
        headers: {
            'authorization': `Bearer ${Cookies.get('accessToken')}`
        }
    })

    if (result.ok) {
        const jsoned = await result.json() as APiResponse<Frisbee>
        return jsoned.response
    } else if (result.status === 401) {
        throw new Error('Vous n\'etes pas authorisé à recuperer ce frisbee')
    }else if (result.status === 404){
        navigate('/404')
        throw new Error('page not found')
    } else {
        throw new Error('Une erreur est survenue')
    }
}

export const deleteOneFrisbee = async (frisbeeId: number): Promise<void> => {

    const result = await fetch(`${VITE_FRISBEE_API_HOST}/frisbees/${frisbeeId}`, {
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

export const editOneFrisbee = async (frisbeeId: number, frisbee: EditFrisbee): Promise<void> => {

    const frisbeeToReturn = frisbee.processId? frisbee : {...frisbee, processId: null}

    const result = await fetch(`${VITE_FRISBEE_API_HOST}/frisbees/${frisbeeId}`, {
        method: 'PATCH',
        headers: {
            'authorization': `Bearer ${Cookies.get('accessToken')}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(frisbeeToReturn)
    })
    if (!result.ok) {
        if (result.status === 401) {
            throw new Error('Vous n\' etes pas authorisé a editer ce frisbee')
        } else {
            throw new Error('Une erreur est survenue')
        }
    }
}

export const createFrisbee = async (frisbee: EditFrisbee): Promise<void> => {

    const result = await fetch(`${VITE_FRISBEE_API_HOST}/frisbees`, {
        method: 'POST',
        headers: {
            'authorization': `Bearer ${Cookies.get('accessToken')}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({...frisbee, processId: null})
    })
    if (!result.ok) {
        if (result.status === 401) {
            throw new Error('Vous n\' etes pas authorisé a editer ce frisbee')
        } else {
            throw new Error('Une erreur est survenue')
        }
    }
}
