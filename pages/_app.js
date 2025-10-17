import '@styles/globals.css'
import { CartProvider } from '../context/CartContext'

function Application({ Component, pageProps }) {
  return (
    <CartProvider>
      <Component {...pageProps} />
    </CartProvider>
  )
}

export default Application
