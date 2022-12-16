import React, {useContext} from 'react'
import {Navigate, useNavigate, useParams} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
import {checkTokens} from "../../services/auth.service";
import {AuthContext} from "../../App";
import {getOneIngredient} from "../../services/ingredient.service";

const Ingredient = () => {
    const navigation = useNavigate()
    const authContext = useContext(AuthContext)
    const {ingredientId} = useParams()

    if (!ingredientId) {
        return (<Navigate to='/404' state={{ from: location }} replace/>)
    }

    const {data, isLoading} = useQuery({
        queryKey: [`ingredient_${ingredientId}`],
        queryFn: async () => {
            await checkTokens(navigation, authContext)
            return await getOneIngredient(parseInt(ingredientId))
        }
    })


    if (isLoading) {
        return (
            <article>
                <div className="px-6 py-4 rounded shadow-lg border">
                    Chargement...
                </div>
                <div className="px-6 mt-5 py-4 rounded shadow-lg border">
                    <h2 className=" underline font-bold text-2xl mb-2">Ingredient</h2>
                    Chargement...
                </div>
            </article>
        )
    }

    return (
        <article>
            <div className="px-6 py-4 rounded shadow-lg border">
                <h2 className=" underline font-bold text-2xl mb-2">{data?.name}</h2>
                <p className="text-gray-700 text-base mb-5">
                    {data?.description}
                </p>
            </div>
        </article>
    )
}

export default Ingredient