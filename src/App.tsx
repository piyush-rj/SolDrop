import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import '@solana/wallet-adapter-react-ui/styles.css';
import AirDrop from './AirDrop';
import { ToastContainer } from 'react-toastify'

  ;
import WalletDropdown from './WalletConnect';


function App() {


  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#000000] via-[#010f01] to-[#000000] flex flex-col font-sans">
      <ConnectionProvider endpoint={"https://api.devnet.solana.com"}>

        {/* WalletProvider: manages connection state */}
        <WalletProvider wallets={[]} autoConnect>
          <WalletModalProvider>

            <ToastContainer
              theme='dark'
              position='bottom-right'
              autoClose={2000}
            />
            <div className="flex justify-between p-8">
              <WalletDropdown />
            </div>

            <div className="flex flex-grow justify-center items-center">
              <AirDrop />
            </div>

          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </div>
  )
}

export default App
