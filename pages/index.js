import Head from 'next/head'
import POSSystem from '@components/POSSystem'

export default function Home() {
  return (
    <div>
      <Head>
        <title>POS System - Point of Sale</title>
        <meta name="description" content="Complete Point of Sale system built with Next.js" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <POSSystem />
    </div>
  )
}
