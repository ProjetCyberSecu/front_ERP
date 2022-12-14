import React, {FC, useContext} from 'react'
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {Link, useNavigate} from "react-router-dom";
import {AuthContext} from "../../App";
import {checkTokens} from "../../services/auth.service";
import {Button} from "primereact/button";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {deleteOneIngredient, getAllIngredient, Ingredient} from "../../services/ingredient.service";

const EditRow = (rowData: Ingredient) => {
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    const authContext = useContext(AuthContext)

    const deleteMutation = useMutation({
        mutationFn: async () => {
            await checkTokens(navigate, authContext)
            await deleteOneIngredient(rowData.id)
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ['all_ingredients']})
        }
    })

    return (
        <>
            <span className="mr-2">
                <Link to={`/ingredients/${rowData.id}/`}>
                    <Button className="p-button-raised p-button-rounded p-button-success" icon="pi pi-eye"/>
                </Link>
            </span>
            <span className="mr-2">
                <Link to={`/ingredients/${rowData.id}/edit`}>
                    <Button className="p-button-raised p-button-rounded p-button-warning" icon="pi pi-file-edit"/>
                </Link>
            </span>
            <span>
                <Button onClick={() => {deleteMutation.mutate()}} loading={deleteMutation.isLoading} loadingIcon="pi pi-spin pi-spinner" className="p-button-raised p-button-rounded p-button-danger" icon="pi pi-trash"/>
            </span>
        </>
    )
}

const IngredientPage: FC = () => {

    const navigate = useNavigate()
    const authContext = useContext(AuthContext)

    const { data, isLoading } = useQuery({
        queryKey: ['all_ingredients'],
        queryFn: async () => {
            await checkTokens(navigate, authContext)
            return await getAllIngredient()
        }
    })

    return (
        <section>
            <div className="mx-auto max-w-7xl mb-5">
                <h1 className="text-4xl font-semibold text-gray-900">Processes</h1>
            </div>
            <DataTable loading={isLoading} value={data} emptyMessage="Aucun ingredient trouvé">
                <Column field="name" sortable={true} header="Nom"/>
                <Column field="description" sortable={true} header="Description"/>
                <Column field="id" header="Actions" body={EditRow}></Column>
            </DataTable>
            <div className="mt-3">
                <Link to="/ingredients/create">
                    <Button label="Ajouter un Ingredient" className="p-button-success" icon="pi pi-plus"/>
                </Link>
            </div>
        </section>
    )
}
export default IngredientPage