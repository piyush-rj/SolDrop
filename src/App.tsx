import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletDisconnectButton, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import '@solana/wallet-adapter-react-ui/styles.css';
import AirDrop from './AirDrop';
import { ToastContainer } from 'react-toastify';


function App() {

  return (
    <div className="h-screen w-full bg-neutral-900 ">
      <ConnectionProvider endpoint={"https://api.devnet.solana.com"}>

        {/* WalletProvider: manages connection state */}
        <WalletProvider wallets={[]} autoConnect>
          <WalletModalProvider>
            
            <ToastContainer 
              position='bottom-right'
              autoClose={2000}
            />
            <div className='flex justify-between p-8'>
              <WalletMultiButton />
              <WalletDisconnectButton />
            </div>
            <div className='h-auto w-full flex justify-center items-center '>
              <AirDrop />
            </div>
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </div>
  )
}

export default App
