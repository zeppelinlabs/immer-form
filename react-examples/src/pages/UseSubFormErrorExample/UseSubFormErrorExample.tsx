import React from 'react'
import { SubmitHandler, useImmerForm, useSubFormError, } from 'immer-form'

type FormExample = {
    name: string,
    age: number,
}

const UseSubFormErrorExample = () => {

    const getDefaultValues = () => {
        return {
            name: "Mary",
            age: 25
        }
    }

    const {
        token,
        handleSubmit,
    }
        = useImmerForm<FormExample>({
            defaults: getDefaultValues(),
        })

    const {
        clearState,
        errorsToShow,
        onModification,
        setShowErrors,
        subToken,
        errors,
        forceShowError,
        isValidationReady
    } = useSubFormError({
        token,
        f: v => v.name,
        deps: []
    })

    const onSubmit: SubmitHandler<FormExample> = async (submitObject) => {
        await alert(`
        Full form: ${submitObject.name} - ${submitObject.age} 
        `)
    }

    return (<div>
        <div className="container">
            <p>useSubFormError let us create a sub form from a token, it is similar to useSubForm
                because you end up getting another token that is included in the original token but
                in this variant you can get more information about the errors such as:<br />
                "errors", <br />
                "forceShowError", <br />
                "isValidationReady" <br />
            </p>
        </div>
        <br />
        <br />
        <div className="container">
            <div>
                <h1>Press the button</h1>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <button
                    disabled={false}
                    type="submit">Submit</button>
            </form>
        </div>
    </div>
    )
}

export default UseSubFormErrorExample