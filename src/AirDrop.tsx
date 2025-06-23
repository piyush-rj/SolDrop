import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { useState } from "react";
import { toast } from "react-toastify";

export default function AirDrop() {

    const {publicKey, signMessage} = useWallet();
    const { connection } = useConnection();
    const [amount, setAmount] = useState<string>("");
    const [balance, setBalance] = useState<number | null>(null);


    const handleAirdrop = async () => {

        if (!publicKey) {
            toast.error("Connect your wallet first")
            return;
        }

        if(!signMessage) {
            toast.error("wallet doesnt support signing message");
            return;
        }

        const sol = parseFloat(amount);
        if (sol <= 0) {
            toast.error("enter a valid amount");
            return;
        }

        try {

            const msg = `Airdrop ${sol} SOL to ${publicKey.toBase58()} at ${new Date().toISOString()}`
            const encodedMessage = new TextEncoder().encode(msg);
            const signature = await signMessage(encodedMessage);

            const isVerified = await import("@noble/curves/ed25519").then(({ed25519}) => {
                return ed25519.verify(signature, encodedMessage, publicKey.toBytes())
            })

            if(!isVerified) {
                toast.error("signature verification failed");
                return;
            }

            await connection.requestAirdrop(publicKey, sol * LAMPORTS_PER_SOL);
            toast.success(`${sol} dropped successfully`)
            return;

        } catch (error) {
            console.log(error);
            toast.error("Airdrop failed");
            return;
        }
    }

    const getBalance = async () => {
        if (publicKey) {
            const bal = await connection.getBalance(publicKey);
            setBalance(bal / LAMPORTS_PER_SOL);
        }
    }

    return <div className="text-white ">
        <div className="flex flex-col justify-center items-center gap-2">

            <textarea
                    value={`Airdrop ${amount || "?"} SOL to ${publicKey?.toBase58()} ?`}
                    readOnly
                    className="w-80 h-20 border border-white bg-transparent px-3 py-1 rounded-md"
                />

            {/* Input box */}
            <input
                className="border border-black px-2 py-1 rounded-md"
                type="text"
                placeholder="Enter SOL"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
            />

            {/* Buttons */}
            <div
                className="flex gap-x-2"
            >
                <button
                    onClick={handleAirdrop}
                    className="px-3 py-1 bg-white text-black rounded cursor-pointer hover:bg-neutral-200 transition-colors duration-150">
                    DROP
                </button>

                <button
                    onClick={getBalance}
                    className="px-3 py-1 bg-white text-black rounded cursor-pointer hover:bg-neutral-200 transition-colors duration-150">
                    Get Balance
                </button>
            </div>

            {/* Balance display */}
            <div className="text-white">
                {balance}
            </div>


        </div>
    </div>
}