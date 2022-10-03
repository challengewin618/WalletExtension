import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const CryptoJS = require("crypto-js");
const hdAddress = require("hd-address");

var mnemonic;

const Main = () => {
  const navigate = useNavigate();
  const [isSaved, setisSaved] = useState(false)
  const [address1, setAddress1] = useState('')
  const [address2, setAddress2] = useState('')
  const [coin_type, setCoinType] = useState('TRX');
  const [displayAddress, setDisplayAddress] = useState('');
  const [btcPrivateKey, setBtcPrivateKey] = useState('');
  const [trxPrivateKey, setTrxPrivateKey] = useState('');

  useEffect(() => {
    if (coin_type == "BTC")
      setDisplayAddress(address1)
    else setDisplayAddress(address2)
  }, [coin_type])

  const goSend = () => {
    if (coin_type == 'BTC') {
      navigate('/send', { state: { type: coin_type, privateKey: btcPrivateKey, mnemonic: mnemonic } });
    } else {
      navigate('/send', { state: { type: coin_type, privateKey: trxPrivateKey, mnemonic: mnemonic } });
    }
  }

  useEffect(() => {
    chrome.storage.local.get(['mnemonic'], function (result) {
      const ciphertext = result.mnemonic;

      if (ciphertext != '' && ciphertext != undefined) {

        mnemonic = CryptoJS.AES.decrypt(ciphertext, 'my-secret-key@123').toString(CryptoJS.enc.Utf8);
        setisSaved(true)

        // const seed = coinjs.bip39.mnemonicToSeed(mnemonic);
        // const btcNode = coinjs.HDNode.fromSeedBuffer(seed, bitcoin.networks.testnet);

        // const btcChild = btcNode.derivePath("m/0'/1/1");
        // setBtcPrivateKey(btcChild.getPrivateKey());
        // console.log(btcChild.getPrivateKey())
        // setAddress1(btcChild.getAddress());

        // const trx = new Address(mnemonic, 0);
        // setTrxPrivateKey(trx.getAddressInfo(0).privateKey);
        // setAddress2(trx.getAddressInfo(0).address);
        // //set trx address as default
        // setDisplayAddress(trx.getAddressInfo(0).address)

        let hd = hdAddress.HD(mnemonic, hdAddress.keyType.mnemonic);
        let hdpath = "m/0'/0/0" // account/change/index
        let { address, pub, pri, path } = hd.BTC_TEST.getAddressByPath(hdpath)
        setBtcPrivateKey(pri);
        setAddress1(address);

        setTrxPrivateKey(hd.TRX.getAddressByPath(hdpath).pri)
        setAddress2(hd.TRX.getAddressByPath(hdpath).address)

        //set trx address as default
        setDisplayAddress(hd.TRX.getAddressByPath(hdpath).address)
      }
    });
  }, []);

  return (
    isSaved ?
      <div className="my-container">
        <div>
          <select id="coin_type" value={coin_type} onChange={e => setCoinType(e.target.value)}>
            <option value="TRX">Tron</option>
            <option value="BTC">Bitcoin</option>
          </select>
        </div>
        <div style={{ wordBreak: "break-all", marginTop: 20 }}>{displayAddress}</div>

        <button style={{ marginTop: 20 }} onClick={goSend}>Send</button>
      </div >
      : <div className="my-container">
        <Link style={{ fontSize: 20 }} to="/create">Create Account</Link>
      </div>
  )
}

export default Main;