import React, {FC, ReactNode, useContext} from 'react'
import {AuthContext} from "../App";
import {Navigate, useLocation} from "react-router-dom";

type Props = {
    children: ReactNode
}

const RequireNotToBeLoggedIn: FC<Props> = ({children}) => {
    const authContext = useContext(AuthContext)
    const location = useLocation()

    if (authContext.user) {
        return <Navigate to='/' state={{ from: location }} replace />
    }

    return (
        <>{children}</>
    )
}

export default RequireNotToBeLoggedIn