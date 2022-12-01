import React from 'react'
import { useImmerForm, useWatch, } from 'immer-form'

type FormExample = {
    name: string,
    age: number,
}

const UseWatchExample = () => {

    const getDefaultValues = () => {
        return {
            name: "Mary",
            age: 25
        }
    }

    const {
        token,
    }
        = useImmerForm<FormExample>({
            defaults: getDefaultValues(),
        })


    const { value } = useWatch({
        token,
        f: v => v,
        deps: v => []
    })

    return (<div>
        <div className="container">
            <p>useWatch let us watch the value of a token, it is useful in situations that we need
                to ask for a certain value in the code or just to print the value in the page.
            </p>
        </div>
        <br />
        <br />
        <div className="container">
            <div>
                <h1>Use watch example</h1>
                <p> The values below are printed using useWatch.<br />
                    Values:<br />
                    name: {value.name}<br />
                    age: {value.age}<br />
                    <br />
                </p>
            </div>
        </div>
    </div>
    )
}

export default UseWatchExample