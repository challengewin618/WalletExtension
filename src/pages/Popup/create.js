import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CryptoJS = require("crypto-js");
const bip39 = require("bip39");

const Create = () => {
    const navigate = useNavigate();
    const [mnemonic, setMnemonic] = useState('asdf')
    var _mnemonic = "";

    const goHome = () => {
        var ciphertext = CryptoJS.AES.encrypt(mnemonic, 'my-secret-key@123').toString();
        chrome.storage.local.set({ mnemonic: ciphertext }, function () { });
        navigate(-1);
    }

    useEffect(() => {
        const _mnemonic = bip39.generateMnemonic();
        setMnemonic(_mnemonic);
    }, []);

    return (
        <div className="my-container">
            <div style={{ fontSize: 20, padding: 20, border: 1, borderColor: "black", borderStyle: "solid" }}>
                {mnemonic}
            </div>
            <button style={{ fontSize: 20, marginTop: 20 }} onClick={goHome}>goHome</button>
        </div>
    )
}

export default Create;