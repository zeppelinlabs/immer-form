import styled from "styled-components"
import { thp } from "../../../styles/themeHelpers"


const Container = styled.div`
    display: flex;
    align-items: center;
    color: ${thp.neutral(c => c.level50)};
    position:relative;
`

const Radio = styled.span`
    display: inline-flex;
    margin-right: 8px;
    position: relative;
    cursor: pointer;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    border: 1px solid ${thp.neutral(c => c.level50)};
    transition: ease-in-out 0.2s;
    position: relative;
    overflow: hidden;
    align-content: center;
    align-items: center;
    justify-content: center;
    justify-items: center;

    &:hover {
        //hover styles
    }

    &:before{
        content: "";
        width: 0px;
        height: 0px;
        border-radius: 50%;
        transition: 0.2s;
        box-sizing: border-box;
    }

`

const Input = styled.input`
    position:absolute;
    top: 9px;
    opacity: 0;

    &:checked + ${Radio} {
        background: ${thp.primary(c => c.level50)};
        border: none;
        &:hover{
            //hover styles when checked
        }

        &:before{
            width: 6px;
            height: 6px;
            background: ${thp.common(c => c.white)};
        }
    }

    &:hover + ${Radio} {
        //hover styles
    }

    &:focus + ${Radio} {
       //focus styles
    }

    &:disabled + ${Radio} {
        //disabled styles
        opacity:.5;
        cursor: not-allowed;
    }

`

export const RadioButtonStyled = {
    Input,
    Radio,
    Container,
}