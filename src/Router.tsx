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
import Cookies from "js-cookie";

const Router = () => {
    const [isLoaded, setIsLoaded] = useState(false)
    const authContext = useContext(AuthContext)

    useEffect(() => {
        const fetchCookie = async () => {
            console.log(Cookies.get('accessToken'))
            const user = await fillStoreFromCookies()
            authContext.user = user.user
            console.log(user)
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
                        <Route path="/" element={<RequireAuth><Dashboard /></RequireAuth>}/>
                        <Route path="/frisbees" element={<RequireAuth><FrisbeesPage /></RequireAuth>}/>
                        <Route path="/frisbees/create" element={<RequireAuth><CreateFrisbee /></RequireAuth>} />
                        <Route path="/frisbee/:frisbeeId/edit" element={<RequireAuth><EditFrisbee /></RequireAuth>}/>
                        <Route path="/frisbee/:frisbeeId" element={<RequireAuth><FrisbeePage /></RequireAuth>}/>
                        <Route path="/ingredients" element={<RequireAuth><IngredientPage /></RequireAuth>}/>
                        <Route path="/ingredients/create" element={<RequireAuth><CreateIngredient /></RequireAuth>}/>
                        <Route path="/processes" element={<RequireAuth><ProcessPage /></RequireAuth>}/>
                        <Route path="/processes/create" element={<RequireAuth><CreateProcess /></RequireAuth>}/>
                        <Route path="/processes/:processId/edit" element={<RequireAuth><EditProcess /></RequireAuth>}/>
                    </Route>
                    <Route path='/login' element={
                        <RequireNotToBeLoggedIn>
                            <Login/>
                        </RequireNotToBeLoggedIn>
                    }/>
                    <Route path="*" element={<Navigate to='/404' state={{ from: location }} replace/>}/>
                </Routes>
            )}
        </>
    )
}

export default Router