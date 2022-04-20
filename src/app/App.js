import {useEffect, useState} from 'react'
import Header from '../components/Header'
import {useConnectedWallet, useLCDClient} from "@terra-money/wallet-provider"
import HomePage from "../components/HomePage"
import {BrowserRouter as Router, Redirect, Route, Switch,} from "react-router-dom"
import Card from "../components/Card"
import Search from "../components/Search"


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
    const commonToken = [
        {token: "ANC", address: "terra1747mad58h0w4y589y3sk84r5efqdev9q4r02pc"},
        {token: "MINE", address: "terra1lqm5tutr5xcw9d5vc4457exa3ghd4sr9mzwdex"},
        {token: "KUJI", address: "terra1azu2frwn9a4l6gl5r39d0cuccs4h7xlu9gkmtd"},
        {token: "bLUNA", address: "terra1u0t35drzyy0mujj8rkdyzhe264uls4ug3wdp3x"},
        {token: "bETH", address: "terra19mkj9nec6e3y5754tlnuz4vem7lzh4n0lc2s3l"},
        {token: "bATOM", address: "terra1pw8kuxf3d7xnlsrqr39p29emwvufyr0yyjk3fg"},
        {token: "aUST", address: "terra1ajt556dpzvjwl0kl5tzku3fc3p3knkg9mkv8jl"},
        {token: "MIR", address: "terra10llyp6v3j3her8u3ce66ragytu45kcmd9asj3u"}
    ]

    const lcd = useLCDClient();
    const connectedWallet = useConnectedWallet()

    useEffect(() => {
 const getAllowance = async () => {
      if (connectedWallet) {
        setFetchPayments(false);
        // Set wallet address
        setWalletAddress(connectedWallet.walletAddress);
        const array = [];

        // Query balance address
        lcd.bank
          .balance(connectedWallet.walletAddress)
          .then(([coins]) => {
            const balance = Number(coins.toDecCoins().get('uusd').div(1000000).toData().amount);
            setBalance(balance.toLocaleString());
          })
          .catch((error) => console.log(error));

        // For each token in the list query allowances
        const promises = commonToken.map(async (element) => {
          const r = await lcd.wasm
            .contractQuery(element.address, {
              all_allowances: {
                owner: connectedWallet.walletAddress,
              },
            })
            .catch((error) => console.log(error));

          // For each allowances make a dictonary with token name, address and allowance
          r.allowances.forEach((allowance) => {
            const expires = allowance.expires?.never ? 'never' : allowance.expires.at_height;
            const iter = {...element, ...allowance, expires};
            array.push(iter);
          })
        });
        await Promise.all(promises);
        setAllowance(array);
      }
    };

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
                    <h1 className="text-center mt-5">Terra Allowances</h1>
                    <h5 className="text-center mt-3">Here's a list of your tokens allowance.</h5>
                        <Card items={allowance}/>
                    </Route>
                    <Route path="/search">
                        <Search/>
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
    backgroundColor: "#EDEDED", fontFamily: "Poppins, sans-serif", fontWeight: "Bold", height: "100vh"
}

export default App;
