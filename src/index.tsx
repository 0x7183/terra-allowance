import { getChainOptions, WalletProvider } from '@terra-money/wallet-provider';
import { Connect } from 'components/Connect';
import React from 'react';
import ReactDOM from 'react-dom';
import './style.css';

function App() {
  return (
    <main style={{ margin: 20, display: 'flex', flexDirection: 'column', gap: 40 }} >
      <Connect />
    </main>
  );
}

getChainOptions().then((chainOptions) => {
  ReactDOM.render(
    <WalletProvider {...chainOptions}>
      <App />
    </WalletProvider>,
    document.getElementById('root'),
  );
});
