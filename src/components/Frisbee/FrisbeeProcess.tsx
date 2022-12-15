import React, {FC} from 'react'
import {Dropdown} from "primereact/dropdown";
import {Process} from "../../services/process.service";
import {Frisbee} from "../../services/frisbee.service";
import {UseMutationResult, UseQueryResult} from "@tanstack/react-query";

type Props = {
    process: Process | null | undefined
    frisbee?: Frisbee
    addProcess: UseMutationResult<void, unknown, number>
    processesQuery: UseQueryResult<Process[]>
}
const FrisbeeProcess: FC<Props> = ({ processesQuery, process, addProcess, frisbee }) => {
    return (
        <article className="px-6 mt-5 py-4 rounded shadow-lg border">
            <h2 className=" underline font-bold text-2xl mb-2">Process</h2>
            {
                process ? (
                    <>
                        <h3 className="text-l mb-5"><span
                            className="underline font-bold ">Nom :</span> {process.name}</h3>
                        <h3 className="text-l mb-5"><span
                            className="underline font-bold ">Description :</span></h3>
                        <p className="text-gray-700 text-base mb-5">
                            {process.description}
                        </p>
                    </>
                ) : 'Pas de process selectioné.'
            }
            <div className="flex">
                {processesQuery.isLoading? "" : <Dropdown placeholder={frisbee?.processId? 'Changer de process' : 'Selectionez un process'} defaultValue={process?.name} onChange={async (e) => {addProcess.mutate(e.value)}} optionLabel="name" optionValue="id" emptyMessage="Pas de Process disponible" options={processesQuery.data}/>}
            </div>
            {addProcess.isError && <span className="text-red-500">Impossible d'ajouter un process pour le moment, merci de reesayer plsu tard</span>}
        </article>
    )
}

export default FrisbeeProcess