import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";

export default function WalletDropdown() {
  const { publicKey, connected, disconnect } = useWallet();
  const { setVisible } = useWalletModal();
  const [open, setOpen] = useState(false);

  const walletAddress = useMemo(() => {
    if (!publicKey) return '';
    return `${publicKey.toBase58().slice(0, 4)}...${publicKey.toBase58().slice(-4)}`;
  }, [publicKey]);

  const handleClick = () => {
    if (connected) {
      setOpen((prev) => !prev);
    } else {
      setVisible(true);
    }
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={handleClick}
        className="bg-neutral-200 hover:bg-neutral-300 text-black px-5 py-3 rounded-lg font-normal tracking-wide transition-colors transform duration-200 cursor-pointer text-[16px]"
      >
            {connected ? `Connected ${walletAddress}` : 'Connect Wallet'}
      </button>

      {open && (
        <div className="absolute left-0 mt-2 w-30 rounded-md shadow-lg ring-1 ring-black/10 z-50">
          <button
            onClick={() => {
              disconnect();
              setOpen(false);
              toast.success("Wallet disconnected successfully")
            }}
            className="w-full bg-neutral-800 rounded-md text-left px-3 py-2 text-sm text-neutral-200 hover:bg-neutral-900 hover:text-red-400 cursor-pointer transition-colors transform duration-150"
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
}