import React from 'react'
import { SubmitHandler, useImmerForm, useToken, useWatch, } from 'immer-form'

type FormExample = {
    name: string,
    age: number,
}

const UseTokenExample = () => {

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

    const nameToken = useToken({
        token,
        f: v => v.name,
        deps: []
    })

    const ageToken = useToken({
        token,
        f: v => v.age,
        deps: []
    })

    const { value: nameTokenValue } = useWatch({
        token: nameToken,
        f: v => v,
        deps: e => []
    })

    const { value: ageTokenValue } = useWatch({
        token: ageToken,
        f: v => v,
        deps: e => []
    })

    const onSubmit: SubmitHandler<FormExample> = async (submitObject) => {
        await alert(`
        Full token: ${submitObject.name} - ${submitObject.age} 
        nameToken: ${nameTokenValue}
        ageToken: ${ageTokenValue}
        `)
    }

    return (<div>
        <div className="container">
            <p>useToken let us create a token from another token, it is useful if you need a large
                form with steps, in this case you may want to split the token in many smaller tokens
                and treat them with different validations or just to mantain certain order in
                the code. Example in the code of this page
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

export default UseTokenExample