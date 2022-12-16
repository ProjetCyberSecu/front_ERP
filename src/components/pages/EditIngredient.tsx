import React, {FC, useContext} from 'react'
import {Navigate, useNavigate, useParams} from "react-router-dom";
import {AuthContext} from "../../App";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {useForm} from "react-hook-form";
import {checkTokens} from "../../services/auth.service";
import {Button} from "primereact/button";
import {editProcessById, getOneProcessById, Process} from "../../services/process.service";
import {EditableIngredient, editIngredientById, getOneIngredient} from "../../services/ingredient.service";

export type EditableProcess = Omit<Process, 'id'>
const EditIngredient: FC = () => {
    const {ingredientId} = useParams()
    const navigation = useNavigate()
    const authContext = useContext(AuthContext)
    const queryClient = useQueryClient()


    if (!ingredientId) {
        return (<Navigate to='/404' state={{ from: location }} replace/>)
    }

    const {data, isLoading} = useQuery({
        queryKey: [`process_${ingredientId}`],
        queryFn: async () => {
            await checkTokens(navigation, authContext)
            return await getOneIngredient(parseInt(ingredientId))
        }
    })

    const {register, handleSubmit, formState: {errors}} = useForm<EditableProcess>()

    const mutation = useMutation({
        mutationFn: async (ingredient: EditableIngredient) => {
            await checkTokens(navigation, authContext)
            await editIngredientById(parseInt(ingredientId), ingredient)
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries()
            navigation('/ingredients')
        }
    })

    const onSubmit = (data: EditableProcess) => {
        if (!mutation.isLoading) {
            mutation.mutate(data)
        }
    }

    if (isLoading) {
        return (
            <section>
                <div className="mx-auto max-w-7xl mb-5">
                    <h1 className="text-4xl font-semibold text-gray-900">Edition d'ingredient {ingredientId}</h1>
                </div>
                <h2>Chargement...</h2>
            </section>
        )
    }


    return (
        <section>
            <div className="mx-auto max-w-7xl mb-5">
                <h1 className="text-4xl font-semibold text-gray-900">Edition d'ingredient</h1>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                        Nom
                    </label>
                    <input
                        defaultValue={data?.name}
                        {...register('name', {required: 'Nom de l\'ingredient obligatoire'})}
                        className={`shadow ${errors.name ? 'shadow-red-500 ' : ''} appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                        id="name" type="text" placeholder="nom"/>
                    {errors.name && <span className='text-red-500'>{errors.name?.message}</span>}
                </div>
                <div className="mb-4">

                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                        Description
                    </label>
                    <textarea
                        defaultValue={data?.description}
                        {...register('description')}
                        id="description" rows={4}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Description..."/>
                </div>
                <div className="mb-4">
                    <Button disabled={mutation.isLoading} type='submit' loading={mutation.isLoading}
                            loadingIcon={'pi pi-spin pi-spinner'} label={`${mutation.isLoading ? '' : 'Enregistrer'}`}/>
                </div>
            </form>
        </section>
    )
}

export default EditIngredient