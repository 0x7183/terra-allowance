import {useEffect, useState} from 'react'
import Header from '../components/Header'
import {useConnectedWallet, useLCDClient} from "@terra-money/wallet-provider"
import HomePage from "../components/HomePage"
import {BrowserRouter as Router, Redirect, Route, Switch,} from "react-router-dom"
import Card from "../components/Card"



function App() {
    const [allowance, setAllowance] = useState([])
    const [balance, setBalance] = useState()
    const [walletAddress, setWalletAddress] = useState()
    const [fetchPayments, setFetchPayments] = useState(true)
/*
    const commonToken = [
        {token: "ANC", address: "terra14z56l0fp2lsf86zy3hty2z47ezkhnthtr9yq76"},
        {token: "MINE", address: "terra1kcthelkax4j9x8d3ny6sdag0qmxxynl3qtcrpy"},
        {token: "KUJI", address: "terra1xfsdgcemqwxp4hhnyk4rle6wr22sseq7j07dnn"},
        {token: "bLUNA", address: "terra1kc87mu460fwkqte29rquh4hc20m54fxwtsx7gp"},
        {token: "bETH", address: "terra1dzhzukyezv0etz22ud940z7adyv7xgcjkahuun"},
        {token: "bATOM", address: "terra18zqcnl83z98tf6lly37gghm7238k7lh79u4z9a"},
        {token: "LunaX", address: "terra17y9qkl8dfkeg4py7n0g5407emqnemc3yqk5rup"},
        {token: "aUST", address: "terra1hzh9vpxhsk8253se0vv5jj6etdvxu3nv8z07zu"},
        {token: "MIR", address: "terra15gwkyepfc6xgca5t5zefzwy42uts8l2m4g40k6"}
    ]*/
    const commonToken = [{token: "bLuna", address: "terra1u0t35drzyy0mujj8rkdyzhe264uls4ug3wdp3x"},
                        {token: "ANC", address: "terra1747mad58h0w4y589y3sk84r5efqdev9q4r02pc"}]

    const lcd = useLCDClient();
    const connectedWallet = useConnectedWallet()

    useEffect(() => {
        const getAllowance = async () => {
            if (connectedWallet) {
                setFetchPayments(false)
                // Set wallet address
                setWalletAddress(connectedWallet.walletAddress);
                const array = [];
                // Query balance address
                lcd.bank.balance(connectedWallet.walletAddress).then(([coins]) => {
                    const balance = Number(coins.toDecCoins().get("uusd").div(1000000).toData().amount);
                    setBalance(balance.toLocaleString());
                }).catch((error) => console.log(error));

                // For each token in the list query allowances
                commonToken.forEach(element =>
                    lcd.wasm.contractQuery(element.address, {
                        all_allowances: {
                            owner: connectedWallet.walletAddress
                        }
                    }).then((r) => {
                        // For each allowances make a dictonary with token name, address and allowance
                        for (let i = 0; i < r.allowances.length;  i++){
                            let expire = r.allowances[i].expires[Object.keys(r.allowances[i].expires)];
                            // If expire is not a number then there is no expire set
                            if (isNaN(expire)){
                                expire = "never";
                            }
                            // Set expires
                            r.allowances[i].expires = expire;
                            var iter = Object.assign({}, element, r.allowances[i])
                            // Push all into array value
                            array.push(iter);
                            
                        }
                        
                        
                    }).catch((error) => console.log(error)));

                // setAllowance
                setAllowance(array);
                

        }
    }

        fetchPayments && getAllowance()

    }, [fetchPayments, connectedWallet, lcd, allowance]);


    return (
        <div style={appStyle} className='App'>
            <Header walletAddress={walletAddress} balanceAmount={balance}/>
            <Router>
                <Switch>
                    <Route path="/home">
                        <HomePage/>
                    </Route>
                    <Route path="/allowances">
                        <Card items={allowance}/>
                    </Route>
                    <Route>
                        <Redirect to="/home"/>
                    </Route>
                </Switch>
            </Router>
        </div>
    );
}

const appStyle = {
    backgroundColor: "#EDEDED", fontFamily: "Poppins, sans-serif", fontWeight: "Bold"
}

export default App;
