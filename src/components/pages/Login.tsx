import React, {FC, useRef, FormEventHandler} from 'react'
import Cookies from "js-cookie";
import {useMutation} from "@tanstack/react-query";
import {login} from "../../services/auth.service";
import Spinner from "../Partials/Spinner/Spinner";
import {Navigate} from "react-router-dom";

const Login: FC = () => {

    const username = useRef<HTMLInputElement>(null)
    const password = useRef<HTMLInputElement>(null)

    const loginMutation = useMutation({
        mutationFn: async () => {
            if (username.current && password.current) {
                await login(username.current.value, password.current.value)
            } else {
                throw new Error('Une erreur est survenue.')
            }
        },
        onSuccess: () => {
            location.replace('/')
        }
    })

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault()
        loginMutation.mutate()
    }

    return (
        <section>
            <div className="flex justify-center pt-10">
                <div className="w-full max-w-xs">
                    <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                                Username
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="username" type="text" placeholder="Username" ref={username}/>
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                                Password
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                                id="password" type="password" placeholder="******************" ref={password}/>
                            {(loginMutation.isError && loginMutation.error instanceof Error) && <p className="text-red-500 text-xs italic">{loginMutation.error.message}</p>}
                        </div>
                        <div className="flex items-center justify-between">
                            <button
                                disabled={loginMutation.isLoading}
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                type="submit">
                                {!loginMutation.isLoading? 'Sign In' : <Spinner />}
                            </button>
                        </div>
                    </form>
                    <p className="text-center text-gray-500 text-xs">
                        &copy;2020 Acme Corp. All rights reserved.
                    </p>
                </div>
            </div>
        </section>
    )
}

export default Login