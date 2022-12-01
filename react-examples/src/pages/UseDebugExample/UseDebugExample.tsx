import React from 'react'
import { SubmitHandler, useDebug, useImmerForm } from 'immer-form'
import { InputField, InputNumericField } from '../../components/Form/ImmerFormFields'

type FormExample = {
    name: string,
    age: number,
}

const UseDebugExample = () => {

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


    const onSubmit: SubmitHandler<FormExample> = async (submitObject) => {
        await alert(`Submitted: ${submitObject.name} - ${submitObject.age}`)
    }

    useDebug({ token, })

    return (<div>
        <div className="container">
            <p> useDebug is a tool that will help you when (as the name says) you debug. you just
                need to give it the token you want to inspect and it will print its state in the
                console every time something changes. you can modify the form below and look at the
                state in the console
            </p>
        </div>
        <br />
        <br />
        <div className="container">
            <div>
                <h1>Change me<h1 className={"exclamation"}>!</h1></h1>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <p>
                    <label htmlFor="name">
                        Name:
                    </label>
                    <InputField
                        token={token}
                        attr={"name"}
                        type={"text"}
                    />

                </p>
                <p>
                    <label htmlFor="age">
                        Age:
                    </label>
                    <InputNumericField
                        token={token}
                        attr={"age"}
                    />

                </p>
                <br />
                <button
                    disabled={false}
                    type="submit">Submit</button>
            </form>
        </div>
    </div>
    )
}

export default UseDebugExample