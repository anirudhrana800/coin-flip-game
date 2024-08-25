import React, { useState } from 'react';
import Web3Modal from 'web3modal';
import { ethers } from 'ethers';
import { CoinbaseWalletSDK } from '@coinbase/wallet-sdk';

const providerOptions = {
  coinbasewallet: {
    package: CoinbaseWalletSDK,
    options: {
      appName: "Web3Modal Demo",
      infuraId: "YOUR_INFURA_PROJECT_ID", // Replace with your Infura Project ID
    },
  },
  // Add Solana wallet adapter options here if needed
};

const WalletConnect = ({ onProviderConnected }) => {
  const [web3Provider, setWeb3Provider] = useState(null);
  const [transactionHash, setTransactionHash] = useState('');
  const [network, setNetwork] = useState(''); // 'ethereum' or 'solana'

  async function connectWallet() {
    try {
      let web3Modal = new Web3Modal({
        cacheProvider: false,
        providerOptions,
      });

      const web3ModalInstance = await web3Modal.connect();
      const web3ModalProvider = new ethers.providers.Web3Provider(web3ModalInstance);
      if (web3ModalProvider) {
        setWeb3Provider(web3ModalProvider);
        setNetwork('ethereum');
        onProviderConnected(web3ModalProvider);

        // Example: Send a test transaction and set transaction hash
        const signer = web3ModalProvider.getSigner();
        const tx = await signer.sendTransaction({
          to: '0xAddress', // Replace with actual address
          value: ethers.utils.parseEther('0.01'), // Replace with actual amount
        });
        setTransactionHash(tx.hash);
      }
    } catch (error) {
      console.error(error);
    }
  }

  function getEtherscanURL(txHash) {
    return `https://etherscan.io/tx/${txHash}`;
  }

  function getSolscanURL(txHash) {
    return `https://solscan.io/tx/${txHash}`;
  }

  return (
    <div>
      {web3Provider == null ? (
        <button onClick={connectWallet}>Connect Wallet</button>
      ) : (
        <div>
          <p>Connected!</p>
          <p>Address: {web3Provider.provider.selectedAddress}</p>
          {transactionHash && network === 'ethereum' && (
            <div>
              <p>Transaction Details:</p>
              <a href={getEtherscanURL(transactionHash)} target="_blank" rel="noopener noreferrer">
                View on Etherscan
              </a>
            </div>
          )}
          {transactionHash && network === 'solana' && (
            <div>
              <p>Transaction Details:</p>
              <a href={getSolscanURL(transactionHash)} target="_blank" rel="noopener noreferrer">
                View on Solscan
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WalletConnect;
