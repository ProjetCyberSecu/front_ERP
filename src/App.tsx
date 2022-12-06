import React, {createContext, StrictMode} from 'react'
import './App.css'
import {QueryClient, QueryClientProvider, useQuery} from '@tanstack/react-query'
import {User} from "./dataValidation/authUserDatavalidation";
import Router from "./Router";

interface IAuthContext {
    user: User | null
}

export const AuthContext = createContext<IAuthContext>({
    user: null
})

function App() {
    const queryClient = new QueryClient()
    return (
        <StrictMode>
            <QueryClientProvider client={queryClient}>
                    <AuthContext.Provider value={{user: null}}>
                        <Router />
                    </AuthContext.Provider>
            </QueryClientProvider>
        </StrictMode>
    )
}

export default App
