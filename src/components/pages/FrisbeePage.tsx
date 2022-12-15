import React, {useContext} from 'react'
import {Navigate, NavigateFunction, useNavigate, useParams} from "react-router-dom";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {checkTokens} from "../../services/auth.service";
import {AuthContext, IAuthContext} from "../../App";
import {editOneFrisbee, Frisbee, getOneFrisbeeById} from "../../services/frisbee.service";
import type {Process} from "../../services/process.service";
import {getAllProcesses, getProcessById} from "../../services/process.service";
import FrisbeeInfo from "../Frisbee/FrisbeeInfo";
import FrisbeeProcess from "../Frisbee/FrisbeeProcess";
import FrisbeeIngredients from "../Frisbee/FrisbeeIngredients";

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
        return <Navigate to='/404' state={{ from: location }} replace/>
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

    return (
        <section>
            <div className="mx-auto max-w-7xl mb-5">
                <h1 className="text-4xl font-semibold text-gray-900">Frisbee n°{frisbeeId}</h1>
            </div>
            <FrisbeeInfo frisbee={data?.frisbee} isLoading={isLoading} />
            <FrisbeeProcess addProcess={addProcess} processesQuery={processes} process={data?.process} frisbee={data?.frisbee}/>
            <FrisbeeIngredients frisbeeId={frisbeeId}/>
        </section>
    )
}

export default FrisbeePage