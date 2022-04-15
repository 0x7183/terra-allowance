import './WalletButton.css';
import truncateAddress from "./Utility";

const WalletButton = ({walletAddress, balanceAmount, coinType, onClick}) => {
    return (
        <button className={"btn btn-dark custom-btn-wallet"}
                onClick={onClick}>
            <span className ={"balance-amount"}>{truncateAddress(walletAddress)}</span>
            <span className={"divider"}>|</span>
            <span className={"balance-amount"}>{balanceAmount}</span>
            <span className={"coin-type"}>{coinType}</span>
        </button>
    );
}

WalletButton.defaultProps = {
    walletAddress: "", balanceAmount: 0
}

export default WalletButton