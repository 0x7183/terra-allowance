import { Fee, MsgExecuteContract, MsgSend } from '@terra-money/terra.js';
import {
    CreateTxFailed,
    Timeout,
    TxFailed,
    TxUnspecifiedError,
    useConnectedWallet,
    UserDenied,
} from '@terra-money/wallet-provider';



export function useRevokeAllowance(callback, callbackError) {

    const connectedWallet = useConnectedWallet();

    const revokeAllowance = (tokenAddress, allowance, spender) => {
        if (!connectedWallet) {
            return;
        }

        connectedWallet
            .post({
                feeDenoms: ["uusd"],
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
            .then((result) => callback(result))
            .catch((error) => {
                if (error instanceof UserDenied) {
                    callbackError('User Denied');
                } else if (error instanceof CreateTxFailed) {
                    callbackError('Create Tx Failed: ' + error.message);
                } else if (error instanceof TxFailed) {
                    callbackError('Tx Failed: ' + error.message);
                } else if (error instanceof Timeout) {
                    callbackError('Timeout');
                } else if (error instanceof TxUnspecifiedError) {
                    callbackError('Unspecified Error: ' + error.message);
                } else {
                    callbackError('Unknown Error: ' + (error instanceof Error ? error.message : String(error)),
                    );
                }
            });
    }

    return { revokeAllowance }
}

export default useRevokeAllowance