import React, {useContext, useEffect, useState} from 'react'
import {Route, Routes} from "react-router-dom";
import {fillStoreFromCookies} from "./services/auth.service";
import {AuthContext} from "./App";
import Home from "./components/pages/Home";
import Login from "./components/pages/Login";
import RequireAuth from "./middlwares/RequireAuth";
import RequireNotToBeLoggedIn from "./middlwares/RequireNotToBeLoggedIn";
import Dashboard from "./components/pages/Dashboard";
import FrisbeePage from "./components/pages/FrisbeePage";
import IngredientPage from "./components/pages/IngredientPage";
import ProcessPage from "./components/pages/ProcessPage";

const Router = () => {
    const [isLoaded, setIsLoaded] = useState(false)
    const authContext = useContext(AuthContext)

    useEffect(() => {
        const fetchCookie = async () => {
            const user = await fillStoreFromCookies()
            authContext.user = user.user
            setIsLoaded(true)
        }
        fetchCookie().then()
    }, [])
    return (
        <>
            {!isLoaded ? '' : (
                <Routes>
                    <Route path='/' element={
                        <RequireAuth>
                            <Home/>
                        </RequireAuth>
                    }>
                        <Route path="/" element={<Dashboard />}/>
                        <Route path="/frisbees" element={<FrisbeePage />}/>
                        <Route path="/ingredients" element={<IngredientPage />}/>
                        <Route path="/processes" element={<ProcessPage />}/>
                    </Route>
                    <Route path='/login' element={
                        <RequireNotToBeLoggedIn>
                            <Login/>
                        </RequireNotToBeLoggedIn>
                    }/>
                </Routes>
            )}
        </>
    )
}

export default Router