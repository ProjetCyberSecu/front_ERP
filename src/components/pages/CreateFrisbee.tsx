import React, {FC, useContext} from 'react'
import {useNavigate} from "react-router-dom";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {checkTokens} from "../../services/auth.service";
import {AuthContext} from "../../App";
import {createFrisbee, Frisbee} from "../../services/frisbee.service";
import {useForm} from "react-hook-form";
import {Button} from "primereact/button";

type EditFrisbee = Omit<Frisbee, 'id' | 'processId'>

const CreateFrisbee: FC = () => {
    const navigation = useNavigate()
    const authContext = useContext(AuthContext)
    const queryClient = useQueryClient()

    const {register, handleSubmit, formState: {errors}} = useForm<EditFrisbee>()

    const mutation = useMutation({
        mutationFn: async (frisbee: EditFrisbee) => {
            await checkTokens(navigation, authContext)
            await createFrisbee(frisbee)
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries(['all_frisbee'])
            navigation('/frisbees')
        }
    })

    const onSubmit = (data: EditFrisbee) => {
        if (!mutation.isLoading) {
            mutation.mutate(data)
        }
    }


    return (
        <section>
            <div className="mx-auto max-w-7xl mb-5">
                <h1 className="text-4xl font-semibold text-gray-900">Creation de frisbee</h1>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                        Nom
                    </label>
                    <input
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

export default CreateFrisbee