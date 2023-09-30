import { object, string,ref } from 'yup';

export const changePasswordValidations=object({
    password: string().required().min(5),
    confirmPassword:string().oneOf([ref('password')]).required()
})