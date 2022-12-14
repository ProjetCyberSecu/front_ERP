import React, {useContext} from 'react'
import {Navigate, NavigateFunction, useNavigate, useParams} from "react-router-dom";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {checkTokens} from "../../services/auth.service";
import {AuthContext, IAuthContext} from "../../App";
import {editOneFrisbee, Frisbee, getOneFrisbeeById} from "../../services/frisbee.service";
import type {Process} from "../../services/process.service";
import {getAllProcesses, getProcessById} from "../../services/process.service";
import {Dropdown} from "primereact/dropdown";

type fullData = {
    frisbee: Frisbee,
    process: Process | null
}

const fetchPageData = async (navigation: NavigateFunction, authContext: IAuthContext, frisbeeId: number): Promise<fullData> => {
    await checkTokens(navigation, authContext)
    const frisbee = await getOneFrisbeeById(frisbeeId, navigation)
    let process = null
    if (frisbee.processId) {
        process = await getProcessById(frisbee.processId)
    }
    return {frisbee, process}
}

const FrisbeePage = () => {
    const {frisbeeId} = useParams()
    const navigation = useNavigate()
    const authContext = useContext(AuthContext)
    const clientQuery = useQueryClient()

    if (!frisbeeId) {
        return <Navigate to='/404'/>
    }

    const {data, isLoading} = useQuery({
        queryKey: [`frisbee_${frisbeeId}`],
        queryFn: async () => {
            return await fetchPageData(navigation, authContext, parseInt(frisbeeId))
        }
    })

    const processes = useQuery({
        queryKey: ['all_processes'],
        queryFn: async () => {
            await checkTokens(navigation, authContext)
            return await getAllProcesses()
        }
    })

    const addProcess = useMutation({
        mutationKey: ['addProcess'],
        mutationFn: async (processId: number) => {
            if (data && data.frisbee) {
                let {id, ...newFrisbee} = {...data?.frisbee}
                newFrisbee.processId = processId
                await checkTokens(navigation, authContext)
                await editOneFrisbee(parseInt(frisbeeId), newFrisbee)
            } else {
                throw new Error('Impossible d\'ajouter un process, veuillez reesayer plus tard')
            }
        },
        onSuccess: async () => {
            await clientQuery.invalidateQueries([`frisbee_${frisbeeId}`])
        }
    })

    if (isLoading) {
        return (
            <section>
                <div className="mx-auto max-w-7xl mb-5">
                    <h1 className="text-4xl font-semibold text-gray-900">Frisbee n°{frisbeeId}</h1>
                </div>
                <div className="px-6 py-4 rounded shadow-lg border">
                    Chargement...
                </div>
                <div className="px-6 mt-5 py-4 rounded shadow-lg border">
                    <h2 className=" underline font-bold text-2xl mb-2">Process</h2>
                    Chargement...
                </div>
            </section>
        )
    }

    return (
        <section>
            <div className="mx-auto max-w-7xl mb-5">
                <h1 className="text-4xl font-semibold text-gray-900">Frisbee n°{frisbeeId}</h1>
            </div>
            <div className="px-6 py-4 rounded shadow-lg border">
                <h2 className=" underline font-bold text-2xl mb-2">{data?.frisbee?.name}</h2>
                <p className="text-gray-700 text-base mb-5">
                    {data?.frisbee?.description}
                </p>
                <h3 className="text-l mb-5"><span
                    className="underline font-bold ">Prix HT :</span> {data?.frisbee?.price_wt}€</h3>
                <h3 className="text-l mb-5"><span className="underline font-bold ">Gamme :</span> {data?.frisbee?.range}
                </h3>
            </div>
            <div className="px-6 mt-5 py-4 rounded shadow-lg border">
                <h2 className=" underline font-bold text-2xl mb-2">Process</h2>
                {
                    data?.process ? (
                        <>
                            <h3 className="text-l mb-5"><span
                                className="underline font-bold ">Nom :</span> {data?.process.name}</h3>
                            <h3 className="text-l mb-5"><span
                                className="underline font-bold ">Description :</span></h3>
                            <p className="text-gray-700 text-base mb-5">
                                {data?.process.description}
                            </p>
                        </>
                    ) : 'Pas de process selectioné.'
                }
                <div className="flex">
                    {processes.isLoading? "" : <Dropdown placeholder={data?.frisbee.processId? 'Changer de process' : 'Selectionez un process'} defaultValue={data?.process?.name} onChange={async (e) => {addProcess.mutate(e.value)}} optionLabel="name" optionValue="id" emptyMessage="Pas de Process disponible" options={processes.data}/>}
                </div>
                {addProcess.isError && <span className="text-red-500">Impossible d'ajouter un process pour le moment, merci de reesayer plsu tard</span>}
            </div>
        </section>
    )
}

export default FrisbeePage