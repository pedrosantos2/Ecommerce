import Center from '@/components/Center';
import Header from '@/components/header'
import { mongooseConnect } from '@/lib/mongoose';
import { Product } from '@/models/Product';
import styled from 'styled-components'
import ProductsGrid from '@/components/ProductsGrid';

const Title = styled.h1`
  font-size: 1.5rem;
`;

export default function ProductPage({products}) {
  return (
    <>
      <Header />
      <Center>
        <Title>Todos os Produtos</Title>
        <ProductsGrid products={products} />
      </Center>

    </>

  )
}

export async function getServerSideProps(){
  await mongooseConnect();
  const products = await Product.find({},null,{sort:{'_id':-1}})
  return {props:{
    products: JSON.parse(JSON.stringify(products)),
  }}
}