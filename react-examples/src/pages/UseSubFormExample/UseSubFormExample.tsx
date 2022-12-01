import React from 'react'
import { SubmitHandler, useImmerForm, useSubForm, } from 'immer-form'

type FormExample = {
    name: string,
    age: number,
}

const UseSubFormExample = () => {

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
        value
    } = useSubForm({
        token,
        f: v => v.name,
        deps: []
    })

    const onSubmit: SubmitHandler<FormExample> = async (submitObject) => {
        await alert(`
        Full form: ${submitObject.name} - ${submitObject.age} 
        sub form: ${value}
        `)
    }

    return (<div>
        <div className="container">
            <p>useSubForm let us create a sub form from a token, it is similar to useToken because
                you end up getting another token that is included in the original token but you can
                get more information that is useful when creating a form such as:<br />
                "clearState" (self explainatory), <br />
                "errorsToShow" (it gives you the errors from the validation of the form), <br />
                "onModification" (you can give another behaviour to the modification of a field
                in the form)<br />
                "setShowErrors" (WIP)<br />
                "subToken" (it gives us the subToken from the original token)<br />
                "value"
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

export default UseSubFormExample