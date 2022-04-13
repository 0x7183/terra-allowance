import './HomePage.css'

function HomePage() {
    return (
        <div className="container p-5">
            <div className="row col-12 mt-3 align-items-center justify-content-center">
                <div className="col-4 mt-5">
                    <h1><b>Manage allowances of your Terra tokens</b></h1>
                    <h5>Connect your wallet to see more</h5>
                </div>
                <div className="col-6">
                    <img className="col-12" src={"terra.jpeg"} alt="terra image"/>
                </div>
            </div>
        </div>
    );
}

export default HomePage;