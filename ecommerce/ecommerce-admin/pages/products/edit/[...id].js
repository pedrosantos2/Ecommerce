import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import ProductForm from "@/components/ProductForm";

export default function EditProductPage() {
  const [produtcInfo, setProductInfo] = useState(null)
  const router = useRouter();
  const { id } = router.query;
  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get('/api/products?id=' + id).then(response => {
     setProductInfo(response.data);
    })
  }, [id])
  return (
    <Layout>
      <h1>Editar</h1>
      {produtcInfo && (
        <ProductForm {...produtcInfo}/>
      )}
    </Layout>
  )
}