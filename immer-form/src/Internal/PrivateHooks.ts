import { useRef, useCallback, useState, useMemo, useEffect } from "react"
import { flatten, getAreEqualShallow, getParentAndChildren, getPathFilter, } from "./PrivateUtil"


const useCurrent = <T,>(value: T) => {
    const current = useRef<T>(value)
    current.current = value
    return current
}



const useFakeState = <T, R>(params: {
    initial: T,
    projection: (s: T) => R,
    equals: (r1: R, r2: R) => boolean,
    fakeEffects?: {
        effect: (s: T, ss: (f: (s: T) => T) => void) => void,
        dep: (s: T) => any[],
    }[],
}) => {
    const [proj, setProj,] = useState<R>(params.projection(params.initial))
    const currentProj = useCurrent(proj)

    const depEqual = useRef(getAreEqualShallow([]))

    const stateRef = useRef<T>(params.initial)

    const checkProj = () => {
        const newProj = params.projection(stateRef.current)
        if (!params.equals(currentProj.current, newProj)) {
            setProj(newProj)
        }
    }

    const checkEffects = (original: T, modified: T) => {
        if (params.fakeEffects) {
            params.fakeEffects.forEach(fe => {
                if (!depEqual.current(fe.dep(original), fe.dep(modified))) {
                    fe.effect(modified, setState)
                }
            })
        }
    }

    const setState = useCallback((f: (s: T) => T) => {
        const original = stateRef.current

        stateRef.current = f(stateRef.current)
        checkEffects(original, stateRef.current)
        checkProj()
    }, [])


    return [
        proj,
        stateRef,
        setState,
    ] as const
}

export type SubNotificationSource = "parent" | "children" | "self"

type SubFunction = (source: SubNotificationSource) => void

export type SubscriptionsReturn = ReturnType<typeof useSubscription>

// eslint-disable-next-line max-lines-per-function
const useSubscription = () => {
    const subscribersDeep = useRef<Record<string, SubFunction[]>>({})
    const subscribersSallow = useRef<Record<string, SubFunction[]>>({})

    const subscribe
        = useCallback((path: string, f: SubFunction, shallow: boolean | undefined) => {
            const subs = shallow ? subscribersSallow : subscribersDeep

            if (!subs.current[path]) {
                subs.current[path] = []
            }
            subs.current[path].push(f)
        }, [])

    const unSubscribe
        = useCallback((path: string, f: SubFunction, shallow: boolean | undefined) => {
            const subs = shallow ? subscribersSallow : subscribersDeep
            const index = subs.current[path].indexOf(f)
            if (index === -1) {
                console.warn("Sub to remove not found", { path, f, })
            } else {
                subs.current[path].splice(index, 1)
            }
            if (subs.current[path].length === 0) {
                delete subs.current[path]
            }
        }, [])

    const notify = useCallback((path: string) => {
        const parentAndChildren = getParentAndChildren(subscribersDeep.current, path)

        const childrenToNotifyDeep
            = flatten(parentAndChildren.children)
        childrenToNotifyDeep.forEach(f => f("parent"))


        const parentsToNotifyDeep
            = flatten(parentAndChildren.parents)
        parentsToNotifyDeep.forEach(f => f("children"))

        const selfToNotify = parentAndChildren.self || []
        selfToNotify.forEach(f => f("self"))


        const parentSegments = path.split(".")
        parentSegments.splice(-1, 1)
        const parent = parentSegments.join(".")


        const selfToNotifyShallow = subscribersSallow.current[path] || []
        selfToNotifyShallow.forEach(f => f("self"))


        const parentToNotifyShallow = subscribersSallow.current[parent] || []
        parentToNotifyShallow.forEach(f => f("children"))

        // console.log("Notify", path,
        //     {
        //         deep: parentsPaths,
        //         shallow: [path, parent,],
        //     }
        //     // { subscribersDeep, subscribersSallow, },
        //     // { deep: getPathsToNotify(subscribersDeep.current, path).map(([p,]) => p), },
        //     // { shallow: [path, parent,], },
        //     // { toNotifyDeep, toNotifyShallow, }
        // )

    }, [])

    const ret = useMemo(() => {
        return {
            subscribe,
            unSubscribe,
            notify,
        }
    }, [subscribe, unSubscribe, notify,])

    return ret

}



const useRender = () => {
    const [, setRender,] = useState<number>(0)
    const pending = useRef(false)
    pending.current = false

    const render = useCallback(() => {
        if (!pending.current) {
            pending.current = true
            setRender(s => s + 1)
        }
    }, [setRender,])

    return render
}



const usePathFilter = <T>(
    getPathObject: () => Record<string, T>,
    path: string
) => {
    const get = useCallback(
        getPathFilter(getPathObject, path),
        [path, getPathObject,]
    )

    return get
}

const useIsMounted = () => {
    const isMountedRef = useRef(true)

    useEffect(() => {
        return () => {
            isMountedRef.current = false
        }
    }, [])


    const isMounted = useCallback(() => {
        return isMountedRef.current
    }, [isMountedRef,])

    return isMounted
}

const useFakeMountEffect = (f: () => void) => {
    const isFirst = useRef(true)

    if (isFirst.current) {
        f()
    }
    isFirst.current = false
}

export const PrivateHooks = {
    useCurrent,
    usePathFilter,
    useRender,
    useSubscription,
    useFakeState,
    useIsMounted,
    useFakeMountEffect,
}