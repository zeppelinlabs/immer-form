import React from 'react'
import { SubmitHandler, useField, useImmerForm } from 'immer-form'
import { InputField, InputNumericField } from '../../components/Form/ImmerFormFields'
import { ExampleStyles } from '../../styles/exampleStyles'

type FormExample = {
    field: {
        name: string,
        age: number,
    }

}

const UseFieldExample = () => {

    const getDefaultValues = () => {
        return {
            field: {
                name: "Mary",
                age: 25
            }
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
        value,
        clearState,
        errorsToShow,
        field,
        loading,
        onBlur,
        onChange,
        subToken
    } = useField({
        token: token,
        attr: "field"
    })

    const onSubmit: SubmitHandler<FormExample> = async (submitObject) => {
        await alert(`Submitted: ${submitObject.field.name} - ${submitObject.field.age}`)
    }



    return (<div>
        <ExampleStyles.Container>
            <ExampleStyles.Paragraph>useField gives you all the tools needed to interact or modify behaviour of a certain
                field in a form, you just need to give it the form's token and the attribute you
                want to focus on
            </ExampleStyles.Paragraph>
        </ExampleStyles.Container>
        <br />
        <br />
        <ExampleStyles.Container>
            <div>
                <h1>Change me<h1 className={"exclamation"}>!</h1></h1>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <p>
                    <label htmlFor="name">
                        Name:
                    </label>
                    <InputField
                        token={subToken}
                        attr={"name"}
                        type={"text"}
                    />

                </p>
                <p>
                    <label htmlFor="age">
                        Age:
                    </label>
                    <InputNumericField
                        token={subToken}
                        attr={"age"}
                    />

                </p>
                <br />
                <button
                    disabled={false}
                    type="submit">Submit</button>
            </form>
        </ExampleStyles.Container>
    </div>
    )
}

export default UseFieldExample