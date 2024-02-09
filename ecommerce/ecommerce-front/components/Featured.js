import styled from "styled-components";
import Center from "./Center";
import PrimaryButton from "./PrimaryButton";
import ButtonLink from "./ButtonLink";
import CartIcon from "./icons/CartIcon";
import { useContext } from "react";
import { CartContext } from "./CartContext";

const Bg = styled.div`
  background-color: #222;
  color: #fff;
  padding: 50px 0;
`;

const Title = styled.h1`
  margin:0;
  font-weight:normal;
  font-size: 3rem;
`;

const Desc = styled.p`
  color:#aaa;
  font-size: .8rem;
`;

const ColumnsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 40px;
  img{
    max-width: 100%;
  }
`;

const Column = styled.div`
  display: flex;
  align-items: center;
`;

const ButtonWrapper = styled.div`
  display: flex;
  gap:12px;
  margin-top: 25px
`;


export default function Featured({product}) {
 const {addProduct} = useContext(CartContext)
  function addFeaturedToCart(){
    addProduct(product._id)
  }
  return (
    <Bg>
      <Center>
        <ColumnsWrapper>
          <Column>
            <div>
              <Title>{product.title}</Title>
              <Desc>{product.description}</Desc>
              <ButtonWrapper>
                <ButtonLink href={'/product/'+product._id} outline={1} white={1} >Saiba Mais</ButtonLink>
                <PrimaryButton onClick={addFeaturedToCart} primary> <CartIcon/>Adicionar ao Carrinho</PrimaryButton>
              </ButtonWrapper>
            </div>
          </Column>
          <Column>
            <img src="https://oxman-next-ecommerce.s3.amazonaws.com/1707520687327.png" />
          </Column>
        </ColumnsWrapper>
      </Center>

    </Bg>
  )
}