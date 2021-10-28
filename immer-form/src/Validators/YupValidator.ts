import * as yup from "yup"
import { useCallback } from "react"
import { FieldsErrors, FieldError } from "../Internal/Validations"
import { FormReturn, useImmerForm, } from "../Internal/UseForm"
export * from "../index"

declare const process: { env: { NODE_ENV: string, }, }

export const isYupError = (e: unknown): e is yup.ValidationError => {
    return "name" in (e as any) && (e as any).name === "ValidationError"
}

export const useYupValidation = <T>(validationSchema?: yup.SchemaOf<T>) => {
    const skipValidateAt: Record<string, boolean> = {}
    return useCallback(
        async (data: T, path?: string): Promise<FieldsErrors | null> => {
            if (validationSchema) {
                try {
                    if (path) {
                        if (!skipValidateAt[path]) {
                            await validationSchema.validateAt(path, data, {
                                abortEarly: false,
                            })
                        } else {
                            return null
                        }
                    } else {
                        await validationSchema.validate(data, {
                            abortEarly: false,
                        })
                    }

                    return {}
                } catch (errors) {
                    if (isYupError(errors)) {
                        return errors.inner.reduce(
                            (allErrors, currentError) => {
                                const path = currentError.path!
                                    .replace(/\[/g, ".")
                                    .replace(/\]/g, "")
                                if (!allErrors[path]) {
                                    allErrors[path] = {
                                        byType: {},
                                        messages: [],
                                        originals: [],
                                    }
                                }

                                const err = allErrors[path]

                                err.messages.push(currentError.message)
                                err.byType[currentError.type!] = currentError.message || true
                                err.originals.push(currentError)


                                return allErrors
                            },
                            {} as { [k: string]: FieldError, }
                        )
                    } else {

                        if (
                            path
                            && (errors as any).message
                            && (errors as { message: string, }).message.startsWith("The schema does not contain the path: ")
                        ) {
                            if (process.env.NODE_ENV === "development") {
                                console.warn("Error validating path", {
                                    error: errors,
                                    path,
                                })
                            }
                            skipValidateAt[path] = true
                            return null

                        } else {
                            console.error("Error validating", errors)
                        }
                        return {}
                    }

                }
            } else {
                return {}
            }
        },
        [validationSchema,]
    )
}


export const useImmerFormYup = <T,>(p: {
    defaults: T,
    validator?: yup.SchemaOf<T>,
    allowSubmitWithoutChanges?: boolean,
}): FormReturn<T> => {
    return useImmerForm({
        ...p,
        validator: useYupValidation(p.validator)
    })
}