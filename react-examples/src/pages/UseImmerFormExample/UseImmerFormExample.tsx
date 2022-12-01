import React from 'react'
import { SubmitHandler, useImmerForm } from 'immer-form'
import { InputField, InputNumericField } from '../../components/Form/ImmerFormFields'

type FormExample = {
    name: string,
    age: number,
}

const UseImmerFormExample = () => {

    const getDefaultValues = () => {
        return {
            name: "Mary",
            age: 25
        }
    }

    const {
        token,
        handleSubmit,
        formState: {
            hasChanges,
            loading,
            submittable,
            submitted,
            valid,
        },
    }
        = useImmerForm<FormExample>({
            defaults: getDefaultValues(),
        })


    const onSubmit: SubmitHandler<FormExample> = async (submitObject) => {
        await alert(`Submitted: ${submitObject.name} - ${submitObject.age}`)
    }

    return (<div>
        <div className="container">
            <p>useImmerForm let us create a form without validations counting with all the features
                of immer to update every value, as well as giving us many form states such as: <br />
                loading: {loading.toString()},<br />
                hasChanges: {hasChanges.toString()},<br />
                submittable: {submittable.toString()},<br />
                submitted: {submitted.toString()},<br />
                valid: {valid.toString()}<br />
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

export default UseImmerFormExample