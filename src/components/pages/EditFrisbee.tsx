import React, {FC, useContext} from 'react'
import {Navigate, useNavigate, useParams} from "react-router-dom";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {checkTokens} from "../../services/auth.service";
import {AuthContext} from "../../App";
import {editOneFrisbee, Frisbee, getOneFrisbeeById} from "../../services/frisbee.service";
import {useForm} from "react-hook-form";
import {Button} from "primereact/button";

type EditFrisbee = Omit<Frisbee, 'id'>

const EditFrisbee: FC = () => {
    const {frisbeeId} = useParams()
    const navigation = useNavigate()
    const authContext = useContext(AuthContext)
    const queryClient = useQueryClient()

    if (!frisbeeId) {
        return (<Navigate to='/404'/>)
    }

    const {data, isLoading} = useQuery({
        queryKey: [`frisbee_${frisbeeId}`],
        queryFn: async () => {
            await checkTokens(navigation, authContext)
            return await getOneFrisbeeById(parseInt(frisbeeId), navigation)
        }
    })

    const {register, handleSubmit, formState: {errors}} = useForm<EditFrisbee>()

    const mutation = useMutation({
        mutationKey: [`frisbee_${frisbeeId}`],
        mutationFn: async (edit: EditFrisbee) => {
            await checkTokens(navigation, authContext)
            await editOneFrisbee(parseInt(frisbeeId), edit)
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries(['all_frisbee', `frisbee_${frisbeeId}`])
            navigation(`/frisbee/${frisbeeId}`)
        }
    })

    const onSubmit = (editedFrisbee: EditFrisbee) => {
        if (!mutation.isLoading) {
            mutation.mutate(editedFrisbee)
        }
    }

    if (isLoading) {
        return (
            <section>
                <div className="mx-auto max-w-7xl mb-5">
                    <h1 className="text-4xl font-semibold text-gray-900">Edition du frisbee {frisbeeId}</h1>
                </div>
                <h2>Chargement...</h2>
            </section>
        )
    }


    return (
        <section>
            <div className="mx-auto max-w-7xl mb-5">
                <h1 className="text-4xl font-semibold text-gray-900">Frisbee {frisbeeId}</h1>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                        Nom
                    </label>
                    <input
                        defaultValue={data?.name}
                        {...register('name', {required: 'Nom du frisbee obligatoire'})}
                        className={`shadow ${errors.name ? 'shadow-red-500 ' : ''} appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                        id="name" type="text" placeholder="Username"/>
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
                        placeholder="Write your thoughts here..."/>

                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
                        Prix HT
                    </label>
                    <input
                        type="number"
                        step={0.01}
                        defaultValue={data?.price_wt}
                        {...register('price_wt', {required: 'Prix HT obligatoire', valueAsNumber: true})}
                        id="price"
                        className={`shadow ${errors.price_wt ? 'shadow-red-500' : ''} appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                        placeholder="Write your thoughts here..."/>
                    {errors.price_wt && <span className='text-red-500'>{errors.price_wt?.message}</span>}

                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="range">
                        Gamme
                    </label>
                    <input
                        type="text"
                        defaultValue={data?.range}
                        {...register('range', {required: 'Gamme obligatoire'})}
                        id="range"
                        className={`shadow ${errors.range ? 'shadow-red-500' : ''} appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                        placeholder="Write your thoughts here..."/>
                    {errors.range && <span className='text-red-500'>{errors.range?.message}</span>}
                </div>
                <div className="mb-4">
                    <Button disabled={mutation.isLoading} type='submit' loading={mutation.isLoading}
                            loadingIcon={'pi pi-spin pi-spinner'} label={`${mutation.isLoading ? '' : 'Enregistrer'}`}/>
                </div>
            </form>
        </section>
    )
}

export default EditFrisbee