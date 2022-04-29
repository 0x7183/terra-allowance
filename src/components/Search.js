
import {Button, Form, FormControl} from "react-bootstrap";
import {Container} from "react-bootstrap";
import {useState} from 'react'
import {useConnectedWallet, useLCDClient} from "@terra-money/wallet-provider"
import Card from "./Card"


function Search() {

    const [allowance, setAllowance] = useState([])
    const [value, setValue] = useState("")

    const lcd = useLCDClient();
    const connectedWallet = useConnectedWallet()
    const [loadingAllowance, setLoadingAllowance] = useState(true)

    function getAllowance(value) {

        const element = {token: "Custom", address: value}

        if (connectedWallet) {
            const array = []
  
            lcd.wasm.contractQuery(element.address, {
                all_allowances: {
                    owner: connectedWallet.walletAddress
                }}).then((r) => {
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
                    
                    setAllowance(array);
                    setLoadingAllowance(false);

                }).catch((error) => console.log(error));

        }
}

    


    return (

        <><Container className={"mt-4 col-6"}>

            <>
                <h1 className="text-center mt-5">Search Allowances</h1>
                <h5 className="text-center mt-3">Here you can look for your allowances on a specific token.</h5>

                <br />
                <Form className="custom-search-box">
                    <FormControl
                        type="search"
                        placeholder="Insert Token Address"
                        className="col-2"
                        aria-label="Search"
                        value={value}
                        onChange={(event) => { setValue(event.target.value); } } />
                    <br />
                    <div class="col text-center">
                        <Button className={"btn btn-dark"} onClick={() => getAllowance(value)}>Search</Button>
                    </div>
                </Form>



            </>
        </Container><Container className={"mt-4 col-12"}>


                <Card items={allowance} loadingCard = {loadingAllowance} />

            </Container></>
        
    )

}

export default Search;