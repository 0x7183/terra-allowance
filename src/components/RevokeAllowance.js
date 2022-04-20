import { Fee, MsgExecuteContract, MsgSend } from '@terra-money/terra.js';
import {
  CreateTxFailed,
  Timeout,
  TxFailed,
  TxUnspecifiedError,
  useConnectedWallet,
  UserDenied,
} from '@terra-money/wallet-provider';
import React, { useCallback, useState } from 'react';

export function useRevokeAllowance() {
  const connectedWallet = useConnectedWallet();

  const revokeAllowance = (tokenAddress, allowance, spender) => {
    if (!connectedWallet) {
      return;
    }
  
    connectedWallet
      .post({
        fee: new Fee(1000000, '200000uusd'),
        msgs: [
          new MsgExecuteContract(
            connectedWallet.walletAddress,
            tokenAddress,
            {
              "decrease_allowance": {
                "spender": spender,
                "amount": allowance,
                "expires": {
                  "at_height": 1
                }
              }
            },
            0
          )
        ]
      })
      .catch((error) => {
        if (error instanceof UserDenied) {
          setTxError('User Denied');
        } else if (error instanceof CreateTxFailed) {
          setTxError('Create Tx Failed: ' + error.message);
        } else if (error instanceof TxFailed) {
          setTxError('Tx Failed: ' + error.message);
        } else if (error instanceof Timeout) {
          setTxError('Timeout');
        } else if (error instanceof TxUnspecifiedError) {
          setTxError('Unspecified Error: ' + error.message);
        } else {
          setTxError('Unknown Error: ' + (error instanceof Error ? error.message : String(error)),
        );
      }
    });
  }
  return { revokeAllowance }
}

export default useRevokeAllowance