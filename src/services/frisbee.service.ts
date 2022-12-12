import Cookies from "js-cookie";
import {Simulate} from "react-dom/test-utils";
import canPlayThrough = Simulate.canPlayThrough;
import {logout} from "./auth.service";
import {NavigateFunction, useNavigate} from "react-router-dom";
import {AuthContext, IAuthContext} from "../App";
import {useContext} from "react";

export type Frisbee = {
    "id": number,
    "name": string,
    "description": string,
    "price_wt": number,
    "range": string,
    "processId": number
}

// TODO Remove this fake list
let frisbeeList: Frisbee[] = [
    {id: 1, name: 'super frisbee', description: '', price_wt: 34.5, range: 'hight quality max 😎😎', processId: 1},
    {id: 2, name: 'frisbee nul', description: '', price_wt: 3, range: 'quality eclatax', processId: 2},
    {id: 3, name: 'frisbee bof en vrai', description: '', price_wt: 10.5, range: 'ca va pour noel genre', processId: 3}
]

/**
 * Function that fetch all Frisbees
 * @param navigate
 * @param authContext
 */
export const getAllFrisbee = async (navigate: NavigateFunction, authContext: IAuthContext): Promise<Frisbee[]> => {

    // TODO uncomment below to request api endpoint

    // const result = await fetch(`${import.meta.env.VITE_FREESBEE_API_HOST}/frisbees`, {
    //     headers: {
    //         'authorization': `Bearer ${Cookies.get('accessToken')}`
    //     }
    // })
    //
    // if (result.ok) {
    //     return await result.json()
    // } else if (result.status === 401) {
    //     logout(navigate, authContext)
    //     return []
    // } else {
    //     throw new Error('Une erreur est survenue')
    // }

    // TODO remove this fake request
    return await new Promise<Frisbee[]>((resolve) => {
        setTimeout(() => {resolve(frisbeeList)}, 500)
    })
}

export const deleteOneFrisbee = async (frisbeeId: number): Promise<void> => {

    // TODO uncomment below to request API
    // const result = await fetch(`${import.meta.env.VITE_FREESBEE_API_HOST}/frisbees/${frisbeeId}`, {
    //     method: 'DELETE',
    //     headers: {
    //         'authorization': `Bearer ${Cookies.get('accessToken')}`
    //     }
    // })
    // if (!result.ok) {
    //     if (result.status === 401) {
    //         throw new Error('Vous n\' etes pas authorisé a suprimer ce frisbee')
    //     } else {
    //         throw new Error('Une erreur est survenue')
    //     }
    // }

    // TODO Remove this fake loading...
    frisbeeList = frisbeeList.filter(e => e.id !== frisbeeId)
    await new Promise(resolve => setTimeout(resolve, 500))
}

export const EditOneFrisbee = async (frisbee: Frisbee): Promise<void> => {

    // TODO uncomment below to request API
    const result = await fetch(`${import.meta.env.VITE_FREESBEE_API_HOST}/frisbees/${frisbee.id}`, {
        method: 'DELETE',
        headers: {
            'authorization': `Bearer ${Cookies.get('accessToken')}`
        },
        body: JSON.stringify(frisbee)
    })
    if (!result.ok) {
        if (result.status === 401) {
            throw new Error('Vous n\' etes pas authorisé a editer ce frisbee')
        } else {
            throw new Error('Une erreur est survenue')
        }
    }

    // TODO Remove this fake loading...
    const index = frisbeeList.findIndex(e => e.id === frisbee.id)
    frisbeeList[index] = frisbee
    await new Promise(resolve => setTimeout(resolve, 500))
}