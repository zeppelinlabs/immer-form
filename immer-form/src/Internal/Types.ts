import { InnerToken, InnerTokenGenerator } from "./PrivateTypes"


export enum TokenType {
    generator = "generator",
    live = "live",
}

export type TokenGenerator<T, S> = {
    _type: TokenType.generator,
    _: InnerTokenGenerator<T, S>,
}


export type TokenLive<T> = {
    _type: TokenType.live,
    _: InnerToken<T>,
}

export type Token<T, S> = TokenLive<T> | TokenGenerator<T, S>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TokenProp<T> = Token<T, any>



export type SubmitHandler<T> = (d: T) => (Promise<void> | void)
