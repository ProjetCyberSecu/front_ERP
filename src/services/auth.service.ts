import Cookies from "js-cookie";
import {authUserSchema, loginSchema, User} from "../dataValidation/authUserDatavalidation";
import jwtDecode from "jwt-decode";

const sampleToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmaXJzdG5hbWUiOiJCQXNpbGUiLCJsYXN0bmFtZSI6IkxlY291dHVyaWVyIiwicm9sZSI6ImFkbWluIn0.JlJJIVyuGIqvsQNKqg8Axy_dFM3UwTrvYocahabIfPc'

export const fillStoreFromCookies = async (): Promise<{user: User} | {user: null}> => {
    const cookieContent: string | undefined = Cookies.get('auth')

    if (cookieContent) {
        try {
            const userObj = jwtDecode(cookieContent)
            return {user: await authUserSchema.validate(userObj)}
            //TODO set user to auth context
        } catch (e) {
            Cookies.remove('auth')
            return {user: null}
        }
    }
    return {user: null}
}

export const login = async (username: string, password: string): Promise<string> => {
    const validatedData = await loginSchema.validate({username, password}).catch(() => {throw new Error('nom d\'utilisateur et mot de passe obligatoire')})
    // TODO fetch data from for real
    // const result = await fetch('')
    await new Promise(resolve => setTimeout(resolve, 3000))
    Cookies.set('auth', sampleToken)
    return sampleToken
}

// export const SetUpLogin = async (jwt: string) => {
//     const authStore = useAuthStore()
//     try {
//         const userObj: User = jwtDecode(jwt)
//         const user: User = await authUserSchema.validate(userObj)
//         Cookies.set('auth', jwt)
//         authStore.setUser(user)
//     } catch (e) {
//         throw  new Error('Une erreur est survenue')
//     }
// }