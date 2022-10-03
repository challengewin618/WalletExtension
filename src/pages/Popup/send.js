import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const CryptoAccount = require("send-crypto");
const TronWeb = require('tronweb')

const Send = () => {
    const navigate = useNavigate();
    const location = useLocation()
    const [address, setAddress] = useState("")
    const [amount, setAmount] = useState(0)
    const [balance, setBalance] = useState(0)
    const [type, setType] = useState("BTC")

    const onSendBTC1 = async () => {
        const privateKey = location.state.privateKey;

        const account = new CryptoAccount(privateKey, { network: "testnet" });

        const txHash = await account
            .send(address, parseFloat(amount), "BTC")
            .on("transactionHash", console.log)
            .on("confirmation", alert('Successfully sent, please wait for 1 minutes.'));
    }

    const onSendTRX = async () => {
        const privateKey = location.state.privateKey;

        const tronWeb = new TronWeb({
            fullHost: 'https://api.shasta.trongrid.io',
            headers: null,
            privateKey: privateKey,
        });

        const res = tronWeb.trx.sendTransaction(address, amount);
        alert('Successfully sent, please wait for 1 minutes.');
        console.log(res);
    }

    const goBack = () => {
        navigate(-1)
    }

    const setValue = async () => {
        const coin_type = location.state.type;
        const privateKey = location.state.privateKey;
        setType(coin_type)

        if (coin_type == 'BTC') {
            const account = new CryptoAccount(privateKey, { network: "testnet" });
            const balance = await account.getBalance("BTC")
            setBalance(balance);
        } else {
            const tronWeb = new TronWeb({
                fullHost: 'https://api.shasta.trongrid.io',
                headers: null,
                privateKey: privateKey,
            });
            const address = tronWeb.address.fromPrivateKey(privateKey);
            tronWeb.trx.getBalance(address).then(result => setBalance(result))
        }
    }

    useEffect(() => {
        setValue()
    }, []);

    return (<div className='my-container' style={{ alignItems: 'flex-start' }}>
        <p>
            Coin Type: {type}
        </p>
        <p>
            Current balance: {balance}
        </p>
        <p>
            Address: <input type="text" placeholder="address" value={address} onChange={e => { setAddress(e.target.value) }} />
        </p>
        <p>
            Amount: <input type="text" placeholder="amount" value={amount} onChange={e => { setAmount(e.target.value) }} />
        </p>
        <div style={{ display: 'flex', marginTop: 20 }}>
            <button onClick={goBack}>Back</button>
            {type == 'BTC' ?
                <div>
                    <button onClick={onSendBTC1}>Send</button>
                </div> :
                <div>
                    <button onClick={onSendTRX}>Send</button>
                </div>}
        </div>
    </div>);
}

export default Send;