import * as yup from "yup"

export const createUserBodySchema = yup.object({
  nickname: yup.string().required("Nickname é obrigatorio"),
  email: yup.string().email().required(),
  password: yup.string().min(6, "A senha tem que ter pelo menos 6 caracteres").required("Senha é obrigatório"),
})
