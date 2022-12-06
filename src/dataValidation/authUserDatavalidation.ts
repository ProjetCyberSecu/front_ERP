import yup, {object, string} from 'yup'

export const authUserSchema = object().shape({
    lastname: string().required(),
    firstname: string().required(),
    role: string().required()
})

export const loginSchema = object({
    username: string().required(),
    password: string().required()
})

export type User = yup.InferType<typeof authUserSchema>