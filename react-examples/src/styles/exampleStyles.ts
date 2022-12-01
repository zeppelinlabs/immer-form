import styled from "styled-components";

const Container = styled.div`
    text-align: center;
    background-color: #FCFCFC;
    box-shadow:0px 10px 24px 5px rgba(0, 0, 0, 0.05);
    border-radius: 32px;
    display:grid;
    justify-content: center;
    margin: auto;
    width: 400px;
`

const Paragraph = styled.p`
    padding:25px;
    text-align: left;
    font-size: small;
`

const Button = styled.button`
  width: 100%;
  padding: 8px 28px;
  height:32px;
  color:white;
  background-color: #000000;
  border:none;
  font-family: DM Serif Text;
  font-size: 12px;
  font-style: normal;
  font-weight: normal;
  border-radius: 10px;
  margin-bottom: 37px;
`

export const ExampleStyles = {
    Container,
    Paragraph,
    Button,
}
