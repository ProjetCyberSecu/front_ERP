import React, {FC, useContext} from 'react'
import {useNavigate} from "react-router-dom";
import {AuthContext} from "../../App";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {useForm} from "react-hook-form";
import {checkTokens} from "../../services/auth.service";
import {Button} from "primereact/button";
import {createProcess, Process} from "../../services/process.service";

export type EditableProcess = Omit<Process, 'id'>
const CreateProcess: FC = () => {
    const navigation = useNavigate()
    const authContext = useContext(AuthContext)
    const queryClient = useQueryClient()

    const {register, handleSubmit, formState: {errors}} = useForm<EditableProcess>()

    const mutation = useMutation({
        mutationFn: async (process: EditableProcess) => {
            await checkTokens(navigation, authContext)
            await createProcess(process)
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries(['all_process'])
            navigation('/processes')
        }
    })

    const onSubmit = (data: EditableProcess) => {
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
                        id="name" type="text" placeholder="nom"/>
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

export default CreateProcess