import Cookies from "js-cookie";
import {EditableProcess} from "../components/pages/CreateProcess";
import {NavigateFunction} from "react-router-dom";
import {Frisbee} from "./frisbee.service";

export type ErpApiResponse = { status: number, response: Process }

export type Process = {
    id: number
    name: string
    description: string
}

export const getProcessById = async (processId: number): Promise<Process> => {
    const result = await fetch(`${import.meta.env.VITE_FRISBEE_API_HOST}/processes/${processId}`, {
        headers: {
            'authorization': `Bearer ${Cookies.get('accessToken')}`
        }
    })

    if (result.ok) {
        const parsedResult = await result.json() as ErpApiResponse
        return parsedResult.response
    } else {
        throw new Error('Une erreur est survenue')
    }
}

export const getAllProcesses = async (): Promise<Process[]> => {
    const result = await fetch(`${import.meta.env.VITE_FRISBEE_API_HOST}/processes`, {
        headers: {
            'authorization': `Bearer ${Cookies.get('accessToken')}`
        }
    })

    if (result.ok) {
        const parsedResult = await result.json() as {status: number, response: Process[]}
        return parsedResult.response
    }
    return []
}

export const createProcess = async (process: EditableProcess): Promise<void> => {

    const result = await fetch(`${import.meta.env.VITE_FRISBEE_API_HOST}/processes`, {
        method: 'POST',
        headers: {
            'authorization': `Bearer ${Cookies.get('accessToken')}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(process)
    })
    if (!result.ok) {
        if (result.status === 401) {
            throw new Error('Vous n\' etes pas authorisé a creer un process')
        } else {
            throw new Error('Une erreur est survenue')
        }
    }
}

export const editProcessById = async (processId: number, process: EditableProcess): Promise<void> => {

    const result = await fetch(`${import.meta.env.VITE_FRISBEE_API_HOST}/processes/${processId}`, {
        method: 'PATCH',
        headers: {
            'authorization': `Bearer ${Cookies.get('accessToken')}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(process)
    })
    if (!result.ok) {
        if (result.status === 401) {
            throw new Error('Vous n\' etes pas authorisé a modifier ce processus')
        } else {
            throw new Error('Une erreur est survenue')
        }
    }
}

export const getOneProcessById = async (processId: number, navigate: NavigateFunction): Promise<Process> => {

    const result = await fetch(`${import.meta.env.VITE_FRISBEE_API_HOST}/processes/${processId}`, {
        headers: {
            'authorization': `Bearer ${Cookies.get('accessToken')}`
        }
    })

    if (result.ok) {
        const jsoned = await result.json() as {status: number, response: Frisbee}
        return jsoned.response
    } else if (result.status === 401) {
        throw new Error('Vous n\'etes pas authorisé à recuperer ce process')
    }else if (result.status === 404){
        navigate('/404')
        throw new Error('page not found')
    } else {
        throw new Error('Une erreur est survenue')
    }
}
