import React, {FC, useContext} from 'react'
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {Link, useNavigate} from "react-router-dom";
import {Button} from "primereact/button";
import type {Frisbee} from "../../services/frisbee.service";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {deleteOneFrisbee, getAllFrisbee} from "../../services/frisbee.service";
import {checkTokens} from "../../services/auth.service";
import {AuthContext} from "../../App";


const EditRow = (rowData: Frisbee) => {
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    const authContext = useContext(AuthContext)

    const mutation = useMutation({
        mutationFn: async () => {
            await checkTokens(navigate, authContext)
            await deleteOneFrisbee(rowData.id)},
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ['all_frisbees']})
        }
    })

    return (
        <>
            <span className="mr-2">
                <Button onClick={() => {mutation.mutate()}} loading={mutation.isLoading} loadingIcon="pi pi-spin pi-spinner" className="p-button-raised p-button-rounded p-button-danger" icon="pi pi-trash"/>
            </span>
            <span>
                <Link to={`/frisbee/${rowData.id}`}>
                <Button className="p-button-raised p-button-rounded p-button-success" icon="pi pi-file-edit"/>
            </Link>
            </span>
        </>
    )
}

const FrisbeePage: FC = () => {

    const navigate = useNavigate()
    const authContext = useContext(AuthContext)

    const {data, isLoading} = useQuery({
        queryKey: ['all_frisbees'],
        queryFn: async () => {
            await checkTokens(navigate, authContext)
            return await getAllFrisbee(navigate, authContext)
        }
    })

    return (
        <section>
            <div className="mx-auto max-w-7xl mb-5">
                <h1 className="text-4xl font-semibold text-gray-900">Frisbes</h1>
            </div>

            <DataTable loading={isLoading} value={data}>
                <Column field="name" sortable={true} header="Nom"/>
                <Column field="price_wt" sortable={true} header="Prix"/>
                <Column field="range" sortable={true} header="Gamme"/>
                <Column field="id" body={EditRow}></Column>
            </DataTable>
        </section>
    )
}

export default FrisbeePage