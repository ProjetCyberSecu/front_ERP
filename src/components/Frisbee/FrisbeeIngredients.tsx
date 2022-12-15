import React, {FC, useContext} from 'react'
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {
    addIngredientToFrisbee,
    deleteIngredientsFrisbee,
    getAllIngredient,
    getIngredientsByFrisbeeId,
    Ingredient
} from "../../services/ingredient.service";
import {checkTokens} from "../../services/auth.service";
import {Link, useNavigate} from "react-router-dom";
import {AuthContext} from "../../App";
import {Button} from "primereact/button";
import {FrisbeeIngredient} from "../../Types";
import {useForm} from "react-hook-form";
import {EditableProcess} from "../pages/EditProcess";

type FormReturn = {
    quantity: number
    ingredientId: number
}

const EditRow: FC<FrisbeeIngredient> = (rowData) => {
    const navigation = useNavigate()
    const authContext = useContext(AuthContext)

    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn: async () => {
            await checkTokens(navigation, authContext)
            await deleteIngredientsFrisbee(rowData.frisbeeId, rowData.ingredient.id)
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries([`frisbee_${rowData.frisbeeId}_ingredients`])
        }
    })

    return (
        <>
            <span>
                <Button onClick={() => {
                    mutation.mutate()
                }} loading={mutation.isLoading} loadingIcon="pi pi-spin pi-spinner"
                        className="p-button-raised p-button-rounded p-button-danger" icon="pi pi-trash"/>
            </span>
        </>
    )
}


type Props = {
    frisbeeId: string
}

const FrisbeeIngredients: FC<Props> = ({frisbeeId}) => {
    const navigation = useNavigate()
    const authContext = useContext(AuthContext)
    const queryClient = useQueryClient()

    const {register, handleSubmit, formState: {errors}} = useForm<FormReturn>()


    const ingredientForCurrentFrisbee = useQuery({
        queryKey: [`frisbee_${frisbeeId}_ingredients`],
        queryFn: async (): Promise<FrisbeeIngredient[]> => {
            await checkTokens(navigation, authContext)
            return await getIngredientsByFrisbeeId(parseInt(frisbeeId))
        }
    })

    const allIngredients = useQuery({
        queryKey: [`all_ingredients`],
        queryFn: async (): Promise<Ingredient[]> => {
            await checkTokens(navigation, authContext)
            return await getAllIngredient()
        }
    })

    const mutation = useMutation({
        mutationFn: async (data: FormReturn) => {
            await checkTokens(navigation, authContext)
            await addIngredientToFrisbee(parseInt(frisbeeId), data.ingredientId, data.quantity)
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries()
        }
    })

    const onSubmit = (data: FormReturn) => {
        if (!mutation.isLoading) {
            mutation.mutate(data)
        }
    }

    return (
        <article className="px-6 mt-5 py-4 rounded shadow-lg border">
            <h2 className=" underline font-bold text-2xl mb-2">Ingredients</h2>

            <DataTable loading={ingredientForCurrentFrisbee.isLoading} value={ingredientForCurrentFrisbee.data}>
                <Column field="ingredient.name" sortable={true} header="Nom"/>
                <Column field="quantity" sortable={true} header="Quantité"/>
                <Column field="id" header="Actions" body={EditRow}></Column>
            </DataTable>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-10 px-6 mt-5 py-4 rounded shadow-lg border">
                <h3 className="font-bold text-xl mb-2">Ajouter un Ingredient au Frisbee</h3>
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="ingredient">
                        Ingredient
                    </label>
                    <select
                        {...register('ingredientId', {required: 'Ingredient obligatoire', valueAsNumber: true})}
                        className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        id="ingredient">
                        <option>Selectionner un ingredient</option>
                        {allIngredients.isLoading ? (
                            <option>Loading...</option>) : allIngredients.data?.map(e => {
                            return (<option key={`${e.id}_${e.name}`} value={e.id}>{e.name}</option>)
                        })}
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                        Username
                    </label>
                    <input
                        {...register('quantity', {required: 'quantité obligatoire'})}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="username" type="number" placeholder="12"/>
                </div>
                <div>
                    <Button className="p-button-raised p-button-success" type="submit" label="Ajouter un ingredient" />
                </div>
            </form>
        </article>
    )
}

export default FrisbeeIngredients