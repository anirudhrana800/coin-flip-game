// src/components/CoinFlipGame.js
import React, { useState } from 'react';
import WalletConnect from './WalletConnect';
import { ethers } from 'ethers';
import './CoinFlipGame.css'; // Import CSS for styling

export function CoinFlipGame() {
  const [betAmount, setBetAmount] = useState('');
  const [selectedSide, setSelectedSide] = useState('');
  const [result, setResult] = useState(null);
  const [message, setMessage] = useState('');
  const [provider, setProvider] = useState(null);

  const handleProviderConnected = (web3Provider) => {
    setProvider(web3Provider);
  };

  const flipCoin = async () => {
    if (!provider) {
      setMessage('Please connect your wallet first.');
      return;
    }

    if (!betAmount || !selectedSide) {
      setMessage('Please select a side and enter a bet amount.');
      return;
    }

    const betAmountInWei = ethers.utils.parseEther(betAmount.toString());

    try {
      const signer = provider.getSigner();

      const transaction = await signer.sendTransaction({
        to: '0x98ffbb3859e8f89cc1bfaaf33479d49858ae1046', // Replace with your address
        value: betAmountInWei,
      });

      await transaction.wait();

      const isHeads = Math.random() >= 0.5;
      const flipResult = isHeads ? 'heads' : 'tails';
      const userWon = flipResult === selectedSide;

      setResult(flipResult);

      if (userWon) {
        setMessage(`Congratulations! You won ${betAmount * 2} tokens! The coin landed on ${flipResult}.`);

        const winningAmountInWei = ethers.utils.parseEther((betAmount * 2).toString());
        const winningTransaction = await signer.sendTransaction({
          to: await signer.getAddress(),
          value: winningAmountInWei,
        });

        await winningTransaction.wait();
        setMessage(`Success! ${ethers.utils.formatEther(winningAmountInWei)} tokens have been added to your wallet.`);
      } else {
        setMessage(`Sorry, you lost your bet of ${betAmount} tokens. The coin landed on ${flipResult}.`);
      }
    } catch (error) {
      console.error('Transaction failed:', error);
      setMessage('Failed to send the transaction.');
    }
  };

  return (
    <div className="coinflip-container">
      {!provider ? (
        <div className="connect-container">
          <h2>Please Connect Your Wallet</h2>
          <WalletConnect onProviderConnected={handleProviderConnected} />
        </div>
      ) : (
        <div className="game-container">
          <h2>Coin Flip Game</h2>
          <div className="input-container">
            <input
              type="number"
              placeholder="Enter bet amount"
              value={betAmount}
              onChange={(e) => setBetAmount(e.target.value)}
              className="input-field"
            />
          </div>
          <div className="buttons-container">
            <button
              onClick={() => setSelectedSide('heads')}
              className={`side-button ${selectedSide === 'heads' ? 'active' : ''}`}
            >
              Heads
            </button>
            <button
              onClick={() => setSelectedSide('tails')}
              className={`side-button ${selectedSide === 'tails' ? 'active' : ''}`}
            >
              Tails
            </button>
          </div>
          <div>
            <button onClick={flipCoin} className="flip-button">Flip Coin</button>
          </div>
          <div className="message-container">
            <p>{message}</p>
            {result && <p>The coin landed on: {result}</p>}
          </div>
        </div>
      )}
    </div>
  );
}

export default CoinFlipGame;
