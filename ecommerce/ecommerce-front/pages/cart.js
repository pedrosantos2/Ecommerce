
import Button from '@/components/Button';
import { CartContext } from '@/components/CartContext';
import Center from '@/components/Center';
import Input from '@/components/Input';
import PrimaryButton from '@/components/PrimaryButton';
import Table from '@/components/Table';
import Header from '@/components/header'
import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import styled from 'styled-components'

const CollumnsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1.2fr .8fr;
  gap: 40px;
  margin-top:40px;

`;

const Box = styled.div`
  background-color: #fff;
  border-radius: 10px;
  padding: 30px;
`;

const ProductInfoCell = styled.td`
  padding: 10px 0;
 
`;

const ProductImageBox = styled.div`
  width: 100px;
  height: 100px;
  padding: 10px;
  border: 1px solid rgba(0,0,0,.1);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  img{
    max-width: 80px;
    max-height: 80px;
  }
`;

const QuatityLabel = styled.span`
  padding: 0 3px;
`;

const CityHolder = styled.div`
  display: flex;
  gap: 5px;
`;

export default function CartPage() {
  const { cartProducts, addProduct, removeProduct, clearCart } = useContext(CartContext)
  const [products, setProducts] = useState([])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [city, setCity] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [streetAdress, setStreetAdress] = useState('')
  const [state, setState] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)
  useEffect(() => {
    if (cartProducts.length > 0) {
      axios.post('/api/cart', { ids: cartProducts }).then(response => {
        setProducts(response.data)
      })
    } else {
      setProducts([])
    }
  }, [cartProducts])
  useEffect(() => {
    if(typeof window === 'undefined'){
      return;
      
    }
    if(window?.location.href.includes('success')){
      setIsSuccess(true)
      clearCart();
    }
  })
 
  function moreOfThisProduct(id) {
    addProduct(id)
  }
  function lessOfThisProduct(id) {
    removeProduct(id)
  }

  async function goToPayment() {
    const response = await axios.post('/api/checkout', {
      name, email, city, postalCode,
      streetAdress, state,cartProducts,
    })
    if (response.data.url) {
      window.location = response.data.url
    }
  }

  let total = 0;
  for (const productId of cartProducts) {
    const price = products.find(p => p._id === productId)?.price || 0;
    total += price
  }

    if (isSuccess) {
      return (
        <>
          <Header />
          <Center>
            <CollumnsWrapper>
              <Box>
                <h1>Obrigado por comprar conosco!</h1>
                <div>enviaremos um email com maiores informações do pedido</div>
              </Box>
            </CollumnsWrapper>

          </Center>
        </>
      )
    }





  return (
    <>
      <Header />
      <Center>
        <CollumnsWrapper>
          <Box>
            <h2>Carrinho</h2>
            {!cartProducts?.length && (
              <div>Carrinho Vazio</div>
            )}
            {products?.length > 0 && (
              <Table>
                <thead>
                  <tr>
                    <th>Produto</th>
                    <th>Quantidade</th>
                    <th>Preço</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    <tr>
                      <ProductInfoCell>
                        <ProductImageBox>
                          <img src={product.images[0]} alt="" />
                        </ProductImageBox>
                        {product.title}
                      </ProductInfoCell>
                      <td>
                        <Button onClick={() => lessOfThisProduct(product._id)}>-</Button>
                        <QuatityLabel>
                          {cartProducts.filter(id => id === product._id).length}
                        </QuatityLabel>
                        <Button onClick={() => moreOfThisProduct(product._id)} >+</Button>
                      </td>
                      <td>
                        ${cartProducts.filter(id => id === product._id).length * product.price}
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td></td>
                    <td></td>
                    <td>R${total}</td>
                  </tr>
                </tbody>
              </Table>
            )}
          </Box>
          {!!cartProducts?.length && (
            <Box>
              <h2>Informações do Pedido</h2>
              <Input type="text" placeholder='Nome:' value={name} name="name" onChange={ev => setName(ev.target.value)} />
              <Input type="text" placeholder='Email:' value={email} name="email" onChange={ev => setEmail(ev.target.value)} />
              <CityHolder>
                <Input type="text" placeholder='Cidade:' value={city} name="city" onChange={ev => setCity(ev.target.value)} />
                <Input type="text" placeholder='CEP:' value={postalCode} name="postalcode" onChange={ev => setPostalCode(ev.target.value)} />
              </CityHolder>
              <Input type="text" placeholder='Endereço:' value={streetAdress} name="streetadress" onChange={ev => setStreetAdress(ev.target.value)} />
              <Input type="text" placeholder='Estado:' value={state} name="state" onChange={ev => setState(ev.target.value)} />
              <PrimaryButton onClick={goToPayment} block primary>Continuar para Pagamento</PrimaryButton>
            </Box>
          )}
        </CollumnsWrapper>
      </Center>
    </>
  )
}