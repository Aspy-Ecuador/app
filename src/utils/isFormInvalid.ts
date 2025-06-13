export function isFormInvalid(inputError: { error: { message: string } }) {
    return inputError.error?.message?.trim() !== "";
}