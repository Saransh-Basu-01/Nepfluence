export type AuthFormValues = {
  email: string
  password: string
}

export function validateAuthForm(values: AuthFormValues) {
  return values.email.includes("@") && values.password.length >= 8
}
