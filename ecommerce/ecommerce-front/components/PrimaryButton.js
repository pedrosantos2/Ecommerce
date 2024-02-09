import styled, { css } from "styled-components"

export const ButtonStyle = css`
border: 0;
  padding: 5px 15px;
  border-radius: 5px;
  cursor: pointer;
  display:inline-flex;
  align-items:center;
  text-decoration:none;
  svg{
    height: 16px;
    margin-right: 5px;
  }
  font-size: 14px;
  ${props => props.white && !props.outline && css`
    background-color: white;
    color: black;
  `}
  ${props => props.white && props.outline && css`
    background-color: transparent;
    color: #fff;
    border: 1px solid white;
  `}
  ${props => props.block && css`
    display: block;
    width: 100%;
  `}
  ${props => props.primary && css`
    background-color: #5542f6;
    color:#fff;
  `}
  ${props => props.size === 'l' && css`
    font-size: 0.9rem;
    padding: 10px 20px;
    svg{
      height: 35px;
    }
  `}
`;

const StyledButton = styled.button`
  ${ButtonStyle}
`;
  

export default function PrimaryButton({children,...rest}){
  return( 
    <StyledButton {...rest}>{children}</StyledButton>
  )
}