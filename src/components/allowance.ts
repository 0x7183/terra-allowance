import {LCDClient} from '@terra-money/terra.js'

async function get_allowance(address: string, token: string){
    const terra = new LCDClient({
        URL: 'https://lcd.terra.dev',
        chainID: 'columbus-5'
    })

    try {
        const result = await terra.wasm.contractQuery(
            token,
            {"all_allowances": {"owner": address}} // query msg
          );
        console.log(result);
    }

    catch (err) {
        console.log("Something went wrong");
    }

    

}

function main() {
    let address: string = "terra1mjws9dnh99q7f5mfx6u4hlahgp60as2n6ggrtn";
    let token: string = "terra17y9qkl8dfkeg4py7n0g5407emqnemc3yqk5rup";
    get_allowance(address, token);
}

main()
