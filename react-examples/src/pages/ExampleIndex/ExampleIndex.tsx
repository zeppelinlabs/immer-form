import React from 'react'
import { Link, } from 'react-router-dom'
import { Paths } from '../Paths'

type Item = {
    title: string,
    to?: string,
}

type ListProps = {
    items: Item[]
}

const hooksItems: Item[] = [
    {
        title: "useImmerForm",
        to: Paths.useImmerForm
    },
    {
        title: "useImmerFormYup",
        to: Paths.useImmerFormYup
    },
    {
        title: "useToken",
        to: Paths.useToken
    },
    {
        title: "useWatch",
        to: Paths.useWatch
    },
    {
        title: "useSubForm",
        to: Paths.useSubForm
    },
    {
        title: "useSubFormToken",
        to: Paths.useSubForm
    },
    {
        title: "useSubFormError",
        to: Paths.useSubFormError
    },
    {
        title: "useArraySubForm"
    },
    {
        title: "useArrayField"
    },
    {
        title: "useField",
        to: Paths.useField
    },
    {
        title: "useDebug",
        to: Paths.useDebug
    },
]

const exampleItems: Item[] = [
    {
        title: "Basic Form Example",
        to: Paths.basicFormExample,
    }
]

const LinkItem = (props: Item) => {

    return <li >
        {props.to
            ? <Link to={props.to}>
                {props.title}
            </Link>
            : `${props.title} (WIP)`}

    </li>
}

const List = (props: ListProps) => {

    return (
        <ul>
            {props.items.map((item, index) =>
                <LinkItem
                    key={index}
                    title={item.title}
                    to={item.to}
                />
            )}
        </ul>
    )
}
const ExampleIndex = () => {

    return <>
        <h1>Immer-Forms Index</h1>
        <h2>Full examples</h2>
        <List
            items={exampleItems}
        />
        <h2>Hooks</h2>
        <List
            items={hooksItems}
        />
    </>

}

export default ExampleIndex