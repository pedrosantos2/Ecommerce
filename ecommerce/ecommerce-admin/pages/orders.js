import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";

export default function OrdersPage() {
  const [orders, setOrders] = useState([])
  useEffect(() => {
    axios.get('/api/orders').then(response => {
      setOrders(response.data)
    })
  }, [])
  return (
    <Layout>
      <h1>Pedidos</h1>
      <table className="basic">
        <thead>
          <tr>
            <th>Data</th>
            <th>Pago</th>
            <th>Recipiente</th>
            <th>Produtos</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 && orders.map(order => (
            <tr>
              <td>{(new Date(order.createdAt)).toLocaleString()}</td>
              <td className={order.paid ? 'text-green-600' : 'text-red-600'}>{order.paid ? 'SIM' : 'NÃO'}</td>
              <td>{order.name} {order.email}<br />
                  {order.city} {order.postalCode} {order.state} <br/>
                  {order.streetAddress}
              </td>
              <td>
                  {order.line_items.map(l => (
                    <>
                      {l.price_data?.product_data.name}  x{l.quantity} <br/>
                    </>
                  ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  )
}