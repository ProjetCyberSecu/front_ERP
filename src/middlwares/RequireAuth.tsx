import React, {FC, ReactNode, useContext} from 'react'
import {AuthContext} from "../App";
import {Navigate, useLocation} from "react-router-dom";

type Props = {
    children: ReactNode
}
const RequireAuth: FC<Props> = ({children}) => {
    const authContext = useContext(AuthContext)
    let location = useLocation();

    if (authContext.user) {
        return <>{children}</>
    }

    return (
        <Navigate to='/login' state={{ from: location }} replace/>
    )
}

export default RequireAuth