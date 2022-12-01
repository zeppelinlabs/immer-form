import React from 'react'
import { SubmitHandler, } from 'immer-form'
import { InputField, InputNumericField } from '../../components/Form/ImmerFormFields'
import { useImmerFormYup } from 'immer-form/Validators/YupValidator'
import * as yup from "yup"

type FormExample = {
    name: string,
    age: number,
}

const useFormValidation = () => {
    const schema: yup.SchemaOf<FormExample> = yup.object().shape({
        name: yup.string().required(),
        age: yup.number().required(),
    })
    return schema
}

const UseImmerFormYupExample = () => {

    const schema = useFormValidation()

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
        = useImmerFormYup<FormExample>({
            defaults: getDefaultValues(),
            validator: schema,
        })


    const onSubmit: SubmitHandler<FormExample> = async (submitObject) => {
        await alert(`Submitted: ${submitObject.name} - ${submitObject.age}`)
    }

    return (<div>
        <div className="container">
            <p>useImmerFormYup let us create a form with a yup schema asociated to it,
                it gives the same form states as useImmerForm: <br />
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

export default UseImmerFormYupExample