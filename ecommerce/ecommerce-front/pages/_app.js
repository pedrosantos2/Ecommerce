import { CartContextProvider } from "@/components/CartContext"
import { createGlobalStyle } from "styled-components"

const GlobalStyles = createGlobalStyle`
@import url('https://fonts.googleapis.com/css2?family=Roboto&display=swap');
  body{
    background-color: #f0f0f0;
    padding:0;
    margin:0;
    font-family: 'Roboto', sans-serif;
  }
`

export default function App({ Component, pageProps }) {
  return(
  <>
    <GlobalStyles/>
    <CartContextProvider>
        <Component {...pageProps} />
    </CartContextProvider>
  </>
  
  ) 
}
