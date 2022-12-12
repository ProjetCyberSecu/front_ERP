import yup, {object, string, number} from 'yup'

export const authUserSchema = object().shape({
    iss: string().required(),
    azp: string().required(),
    exp: number().required(),
    iat: number().required(),

})

export const loginSchema = object({
    username: string().required(),
    password: string().required()
})

export type User = yup.InferType<typeof authUserSchema>