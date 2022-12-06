import React, {FC} from 'react'
import {Link, Outlet} from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";

const Home: FC = () => {
    return (
        <section>
            <Sidebar />
            <div>
                <Link to='/'>dashboard</Link>
                <Link to='/test'>test</Link>
            </div>
            <Outlet/>
        </section>
    )
}

export default Home