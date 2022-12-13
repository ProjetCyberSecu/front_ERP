import React, {FC, useContext} from 'react'
import {Navigate, useNavigate, useParams} from "react-router-dom";
import {AuthContext} from "../../App";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {useForm} from "react-hook-form";
import {checkTokens} from "../../services/auth.service";
import {Button} from "primereact/button";
import {editProcessById, getOneProcessById, Process} from "../../services/process.service";

export type EditableProcess = Omit<Process, 'id'>
const EditProcess: FC = () => {
    const {processId} = useParams()
    const navigation = useNavigate()
    const authContext = useContext(AuthContext)
    const queryClient = useQueryClient()


    if (!processId) {
        return (<Navigate to='/404'/>)
    }

    const {data, isLoading} = useQuery({
        queryKey: [`process_${processId}`],
        queryFn: async () => {
            await checkTokens(navigation, authContext)
            return await getOneProcessById(parseInt(processId), navigation)
        }
    })

    const {register, handleSubmit, formState: {errors}} = useForm<EditableProcess>()

    const mutation = useMutation({
        mutationFn: async (process: EditableProcess) => {
            await checkTokens(navigation, authContext)
            await editProcessById(parseInt(processId), process)
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

    if (isLoading) {
        return (
            <section>
                <div className="mx-auto max-w-7xl mb-5">
                    <h1 className="text-4xl font-semibold text-gray-900">Edition du frisbee {processId}</h1>
                </div>
                <h2>Chargement...</h2>
            </section>
        )
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
                        defaultValue={data?.name}
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

export default EditProcess