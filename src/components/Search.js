import {Button, Form, FormControl} from "react-bootstrap";
import {Card, Container, Table} from "react-bootstrap";


function Search() {

    return (

        <Container className={"mt-4 col-6"}>
        
        <>
            <h1 className="text-center mt-5">Search Allowances</h1>
            <h5 className="text-center mt-3">Here you can look for your allowances on a specific token.</h5>

            
            <Form className="custom-search-box">
                    <FormControl
                        type="search"
                        placeholder="Insert Token Address"
                        className="col-2"
                        aria-label="Search"
                    />
                <div class="col text-center">
                <Button className={"btn btn-dark"}>Search</Button>
                </div>
            </Form>

        </>
        </Container>
    )

}

export default Search;