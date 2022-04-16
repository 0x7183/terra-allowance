import {Card, Container, Pagination, Table} from "react-bootstrap";
import './Card.css';
import PropTypes from "prop-types";
import truncateAddress from "./Utility";
import {useState} from "react";
import revokeAllowance from "./RevokeAllowance";

const CustomCard = ({items}) => {
    const itemsPerPage = 10
    const lastPage = Math.floor(items.length / itemsPerPage + 1)
    const [currentPage, setCurrentPage] = useState(1)
    let currentItems = items.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    
    function goToFirstPage() {
        setCurrentPage(1)
    }
    
    function goToPreviousPage() {
        setCurrentPage(currentPage - 1)
    }
    
    function goToNextPage() {
        setCurrentPage(currentPage + 1)
    }
    
    function goToLastPage() {
        setCurrentPage(lastPage)
    }
    
    return (
        <Container className={"mt-4 col-6"}>
        
        <>
        <Card className={"custom-card mt-5"}>
        <Card.Body>
        <div class="table-responsive">
        <Table borderless={true}>
        <thead className={"custom-header"}>
        <tr className={"col-12"}>
        <th className={"col-4"}>Token</th>
        <th className={"col-4 text-center"}>Spender</th>
        <th className={"col-4 text-center"}>Allowance</th>
        <th className={"col-4 text-center"}>Expires</th>
        <th className={"col-4 text-center"}>Revoke</th>
        </tr>
        </thead>
        <tbody>
        {currentItems.map((item) => (
            <tr className={"col-12"}>
            <td className={"col-4"}>{item.token}</td>
            <td className={"col-4 text-center"}>{truncateAddress(item.spender)}</td>
            <td className={"col-4 text-center"}>{item.allowance / 1000000}</td>
            <td className={"col-4 text-center"}>{item.expires}</td>
            <td className={"col-4 text-center"}>
            <button className={"custom-btn text-white"} onClick={() => revokeAllowance(item.address)}>Revoke</button>
            </td>
            
            </tr>))
        }
        </tbody>
        </Table>
        </div>
        </Card.Body>
        </Card>
        </>
        <Pagination className="mt-2 pb-2 custom-pagination justify-content-center">
        {currentPage > 1 && <Pagination.Prev onClick={goToPreviousPage}/>}
        {currentPage > 2 && <Pagination.Item onClick={goToFirstPage}>{1}</Pagination.Item>}
        {currentPage > 2 && <Pagination.Ellipsis/>}
        {currentPage > 1 && <Pagination.Item onClick={goToPreviousPage}>{currentPage - 1}</Pagination.Item>}
        <Pagination.Item active>{currentPage}</Pagination.Item>
        {currentPage < lastPage && <Pagination.Item onClick={goToNextPage}>{currentPage + 1}</Pagination.Item>}
        {currentPage < lastPage - 1 && <Pagination.Ellipsis/>}
        {currentPage < lastPage - 1 && <Pagination.Item onClick={goToLastPage}>{lastPage}</Pagination.Item>}
        {currentPage < lastPage - 1 && <Pagination.Next onClick={goToNextPage}/>}
        </Pagination>
        </Container>
        )
    }
    
    export default CustomCard;