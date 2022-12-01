import { useRef, useImperativeHandle } from "react"

export type HTMLSetCustomValidityElement = {
    setCustomValidity: HTMLInputElement["setCustomValidity"],
}


export const useSetCustomValidity = <HTMLT extends HTMLSetCustomValidityElement>(
    forwadRef: React.ForwardedRef<HTMLSetCustomValidityElement>
) => {


    const element = useRef<HTMLT | null>(null)

    useImperativeHandle(forwadRef, () => ({
        setCustomValidity: (m: string) => {
            element.current?.setCustomValidity(m)
        },
    }))

    return element
}