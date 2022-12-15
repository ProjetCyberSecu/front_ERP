import React, {FC} from 'react'
import {Frisbee} from "../../services/frisbee.service";

type Props = {
    isLoading: boolean
    frisbee?: Frisbee
}

const FrisbeeInfo: FC<Props> = ({ isLoading, frisbee }) => {

    if (isLoading) {
        return (
            <article>
                <div className="px-6 py-4 rounded shadow-lg border">
                    Chargement...
                </div>
                <div className="px-6 mt-5 py-4 rounded shadow-lg border">
                    <h2 className=" underline font-bold text-2xl mb-2">Process</h2>
                    Chargement...
                </div>
            </article>
        )
    }

    return (
        <article>
            <div className="px-6 py-4 rounded shadow-lg border">
                <h2 className=" underline font-bold text-2xl mb-2">{frisbee?.name}</h2>
                <p className="text-gray-700 text-base mb-5">
                    {frisbee?.description}
                </p>
                <h3 className="text-l mb-5"><span
                    className="underline font-bold ">Prix HT :</span> {frisbee?.price_wt}€</h3>
                <h3 className="text-l mb-5"><span className="underline font-bold ">Gamme :</span> {frisbee?.range}
                </h3>
            </div>
        </article>
    )
}

export default FrisbeeInfo