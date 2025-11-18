import type { Metadata } from 'next'
import './globals.css'
import { WalletProvider } from '@/components/WalletProvider'

export const metadata: Metadata = {
  title: 'BagFlip Casino | bagflip.xyz',
  description: 'Flip your bag, win big. 100% fair VRF casino on Solana.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white">
        <WalletProvider>
          {children}
        </WalletProvider>
      </body>
    </html>
  )
}
