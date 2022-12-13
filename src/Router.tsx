import React, {useContext, useEffect, useState} from 'react'
import {Navigate, Route, Routes} from "react-router-dom";
import {fillStoreFromCookies} from "./services/auth.service";
import {AuthContext} from "./App";
import Home from "./components/pages/Home";
import Login from "./components/pages/Login";
import RequireAuth from "./middlwares/RequireAuth";
import RequireNotToBeLoggedIn from "./middlwares/RequireNotToBeLoggedIn";
import Dashboard from "./components/pages/Dashboard";
import FrisbeesPage from "./components/pages/FrisbeesPage";
import FrisbeePage from "./components/pages/FrisbeePage";
import IngredientPage from "./components/pages/IngredientPage";
import ProcessPage from "./components/pages/ProcessesPage";
import EditFrisbee from "./components/pages/EditFrisbee";
import CreateFrisbee from "./components/pages/CreateFrisbee";
import CreateProcess from "./components/pages/CreateProcess";
import EditProcess from "./components/pages/EditProcess";
import CreateIngredient from "./components/pages/CreateIngredient";

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
                        <Route path="/frisbees" element={<FrisbeesPage />}/>
                        <Route path="/frisbees/create" element={<CreateFrisbee />} />
                        <Route path="/frisbee/:frisbeeId/edit" element={<EditFrisbee />}/>
                        <Route path="/frisbee/:frisbeeId" element={<FrisbeePage />}/>
                        <Route path="/ingredients" element={<IngredientPage />}/>
                        <Route path="/ingredients/create" element={<CreateIngredient />}/>
                        <Route path="/processes" element={<ProcessPage />}/>
                        <Route path="/processes/create" element={<CreateProcess />}/>
                        <Route path="/processes/:processId/edit" element={<EditProcess />}/>
                    </Route>
                    <Route path='/login' element={
                        <RequireNotToBeLoggedIn>
                            <Login/>
                        </RequireNotToBeLoggedIn>
                    }/>
                    <Route path="*" element={<Navigate to="/404"/>}/>
                </Routes>
            )}
        </>
    )
}

export default Router