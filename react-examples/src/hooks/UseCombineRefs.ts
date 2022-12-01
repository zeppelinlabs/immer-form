import React from "react"

export const UseCombinedRefs = <T,>(
    ...refs: (React.ForwardedRef<T | null> | React.MutableRefObject<T | null>)[]
) => {
    const targetRef = React.useRef<T | null>(null)

    React.useEffect(() => {
        refs.forEach(ref => {
            if (!ref) {
                return
            }

            if (typeof ref === "function") {
                ref(targetRef.current)
            } else {
                ref.current = targetRef.current
            }
        })
    }, [refs,])

    return targetRef
}