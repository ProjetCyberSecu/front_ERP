import Cookies from "js-cookie";
import {authUserSchema, loginSchema, User} from "../dataValidation/authUserDatavalidation";
import jwtDecode from "jwt-decode";
import {IAuthContext} from "../App";
import {NavigateFunction} from "react-router-dom";
import dayjs from "dayjs";
import {VITE_AUTH_API_HOST} from "../env";

/**
 * Function that fill ReactAuthContext depending on cookies
 * You might call it after you filled or removed auth cookies
 */
export const fillStoreFromCookies = async (): Promise<{ user: User } | { user: null }> => {
    const accessToken: string | undefined = Cookies.get('accessToken')
    const refreshToken: string | undefined = Cookies.get('refreshToken')

    console.log(accessToken, refreshToken)

    if (accessToken && refreshToken) {
        try {
            const userObj = jwtDecode(accessToken)
            return {user: await authUserSchema.validate(userObj)}
        } catch (e) {
            Cookies.remove('accessToken')
            Cookies.remove('refreshToken')
            return {user: null}
        }
    }
    return {user: null}
}

/**
 * Function that connect user depending on provided username and password
 * @param authContext
 * @param username
 * @param password
 */
export const login = async (authContext: IAuthContext, username: string, password: string): Promise<void> => {
    await loginSchema.validate({username, password}).catch(() => {
        throw new Error('nom d\'utilisateur et mot de passe obligatoire')
    })
    const loginResult = await fetch(`${VITE_AUTH_API_HOST}/api/auth/login`, {
        method: 'POST',
        body: JSON.stringify({
            username,
            password
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    if (loginResult.ok) {
        try {
            const responseContent = await loginResult.json() as { accessToken: string, refreshToken: string }
            const {accessToken, refreshToken} = responseContent
            Cookies.set('accessToken', accessToken, {sameSite: 'strict'})
            Cookies.set('refreshToken', refreshToken, {sameSite: 'strict'})
            await fillStoreFromCookies()
        } catch (e) {
            throw new Error('Une erreur est survenue veuillez reesayer plus tard')
        }
    } else if (loginResult.status === 401) {
        throw new Error('Identifiant ou mot de passe incorrecte')
    } else {
        throw new Error('Une erreur est survenue veuillez reesayer plus tard')
    }
}

/**
 * Function that logout user and redirect it to login page
 * @param navigate
 * @param authContext
 */
export const logout = (navigate: NavigateFunction, authContext: IAuthContext): void => {
    Cookies.remove('accessToken')
    Cookies.remove('refreshToken')
    authContext.user = null
    navigate('/login')
}

/**
 * Function that check if token are still valid and try to refresh them if not. OR logout user if it fails.
 * Call it every time you need to request logic API
 * @param navigation
 * @param authContext
 */
export const checkTokens = async (navigation: NavigateFunction,authContext: IAuthContext) => {
    if (!authContext.user) {
        logout(navigation, authContext)
        return
    }

    const expirationDate = dayjs.unix(authContext.user.exp)

    if (dayjs().diff(expirationDate, 'minutes') >= -2) {
        console.log('Refreshing tokens')
        const result = await fetch(`${VITE_AUTH_API_HOST}/api/auth/refresh`, {
            method: 'POST',
            headers: {
                authorization: `Bearer ${Cookies.get('refreshToken')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                accessToken: Cookies.get('accessToken')
            })
        })

        if (result.ok) {
            const { accessToken, refreshToken } = await result.json()
            Cookies.set('accessToken', accessToken, {sameSite: 'strict'})
            Cookies.set('refreshToken', refreshToken, {sameSite: 'strict'})
            const {user} = await fillStoreFromCookies()
            authContext.user = user
        } else {
            logout(navigation, authContext)
        }
    }
}
