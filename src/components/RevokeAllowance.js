import { Fee, MsgExecuteContract, MsgSend } from '@terra-money/terra.js';
import {
  CreateTxFailed,
  Timeout,
  TxFailed,
  TxUnspecifiedError,
  useConnectedWallet,
  UserDenied,
} from '@terra-money/wallet-provider';

export function revokeAllowance(tokenAddress, spender) {
  const connectedWallet = useConnectedWallet();

  if (!connectedWallet) {
    return;
  }
  
  setTxResult(null);
  setTxError(null);

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
              "amount": "0",
              "expires": {
                "at_height": 1
              }
            }
          },
          ''
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

export default revokeAllowance