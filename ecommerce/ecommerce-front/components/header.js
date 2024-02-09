import Link from "next/link";
import styled from "styled-components";
import Center from "./Center";
import { useContext } from "react";
import { CartContext } from "./CartContext";


const StyleHeader = styled.header`
  background-color: #222;
`;

const Logo = styled(Link)`
color: #ffff;
text-decoration: none;
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px 0;
`;

const StyledNav = styled.nav`
  display: flex;
  gap: 10px;
`;

const NavLink = styled(Link)`
  color: #aaa;
  text-decoration: none;
`;

export default function header() {
  const {cartProducts} = useContext(CartContext)
  return (
    <StyleHeader>
      <Center>
        <Wrapper>
          <Logo href={'/'}>Ecommerce</Logo>
          <StyledNav>
            <NavLink href={'/'}>Home</NavLink>
            <NavLink href={'/products'}>Todos os Produtos</NavLink>
            <NavLink href={'/categories'}>Categorias</NavLink>
            <NavLink href={'/account'}>Conta</NavLink>
            <NavLink href={'/cart'}>Carrinho ({cartProducts.length})</NavLink>
          </StyledNav>
        </Wrapper>
      </Center>
    </StyleHeader>
  )

  
}