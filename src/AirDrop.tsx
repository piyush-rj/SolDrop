import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { Webhook } from "lucide-react"
import { useState } from "react";
import { toast } from "react-toastify";

export default function AirDrop() {

    const { publicKey, signMessage, sendTransaction } = useWallet();
    const { connection } = useConnection();
    const [amount, setAmount] = useState<string>("");
    const [balance, setBalance] = useState<number | null>(null);
    const [receiver, setReceiver] = useState<string>("");
    const [sendAmount, setSendAmount] = useState<string>("");


    const handleAirdrop = async () => {

        if (!publicKey) {
            toast.error("Connect your wallet first")
            return;
        }

        if (!signMessage) {
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

            const isVerified = await import("@noble/curves/ed25519").then(({ ed25519 }) => {
                return ed25519.verify(signature, encodedMessage, publicKey.toBytes())
            })

            if (!isVerified) {
                toast.error("signature verification failed");
                return;
            }

            await connection.requestAirdrop(publicKey, sol * LAMPORTS_PER_SOL);
            toast.success(`${sol} SOL dropped successfully`)
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

    const sendSOL = async () => {
        if (!publicKey) {
            toast.error("Wallet not connected");
            return;
        }

        if (!receiver) {
            toast.error("Enter receiver's public key");
            return;
        }

        const toPubkey = new PublicKey(receiver);
        const lamports = parseFloat(sendAmount) * LAMPORTS_PER_SOL;
        if (isNaN(lamports) || lamports <= 0) {
            toast.error("Invalid amount");
            return;
        }


        try {
            const transaction = new Transaction();

            transaction.add(SystemProgram.transfer({
                fromPubkey: publicKey,
                toPubkey,
                lamports
            }))

            await sendTransaction(transaction, connection);
            toast.success(`Sent ${sendAmount} SOL to ${receiver}`)
        } catch (error) {
            console.log("send transaction error", error);
            toast.error("Transaction failed")
        }
    }

    return (
        <div className="bg-[#0a0a0a] border border-gray-800 rounded-lg p-6 w-[380px] shadow-lg">
            <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center gap-2">
                    <Webhook className="w-6 h-6 text-emerald-500" />
                    <h2 className="text-[21px] font-normal text-emerald-500 tracking-wide">
                        SOLDROP
                    </h2>
                </div>
            </div>



            <div className="space-y-4">
                <input
                    className="w-full px-3 py-2.5 rounded-md bg-[#111111] text-white border border-gray-700 focus:outline-none focus:border-emerald-500 transition-colors placeholder-gray-500 text-sm"

                    type="text"
                    placeholder="Enter SOL amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />

                <div className="flex gap-2">
                    <button
                        onClick={handleAirdrop}
                        className="flex-1 bg-emerald-800 hover:bg-emerald-900 text-white font-normal tracking-wide py-2.5 px-4 rounded-md transition-colors text-[15px] cursor-pointer"
                    >
                        Airdrop
                    </button>
                    <button
                        onClick={getBalance}
                        className="flex-1 bg-neutral-800/80 hover:bg-gray-800/50 text-gray-200 font-normal tracking-wide py-2.5 px-4 rounded-md transition-colors text-[15px] cursor-pointer"
                    >
                        Balance
                    </button>
                </div>

                {balance !== null && (
                    <div className="text-center py-3 px-4 bg-[#111111] rounded-md border border-gray-800">
                        <div className="text-gray-400 text-xs mb-1">Balance</div>
                        <div className="text-lg font-medium text-white">
                            {balance} <span className="text-emerald-600">SOL</span>
                        </div>
                    </div>
                )}

                <div className="border-t border-gray-800 pt-4 mt-6">
                    <h3 className="text-gray-300 text-sm font-medium mb-3">Send SOL</h3>

                    <div className="space-y-3">
                        <input
                            type="text"
                            placeholder="Receiver's public key"
                            className="w-full px-3 py-2.5 rounded-md bg-[#111111] text-white border border-gray-700 focus:outline-none focus:border-emerald-500 transition-colors placeholder-gray-500 text-sm"
                            onChange={(e) => setReceiver(e.target.value)}
                            value={receiver}
                        />

                        <input
                            type="text"
                            placeholder="Amount to send"
                            className="w-full px-3 py-2.5 rounded-md bg-[#111111] text-white border border-gray-700 focus:outline-none focus:border-emerald-500 transition-colors placeholder-gray-500 text-sm"
                            onChange={(e) => setSendAmount(e.target.value)}
                            value={sendAmount}
                        />

                        <button
                            onClick={sendSOL}
                            className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-normal tracking-wide py-2.5 px-4 rounded-md transition-colors duration-200 cursor-pointer text-[15px]"
                        >
                            Send SOL
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}