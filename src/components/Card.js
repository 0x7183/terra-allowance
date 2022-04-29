import {Card, Container, Pagination, Table} from "react-bootstrap";
import './Card.css';
import truncateAddress from "./Utility";
import {useState} from "react";
import { useRevokeAllowance } from "./RevokeAllowance";
import {Button, Skeleton} from "@mui/material";
import {WaitDialog} from './dialog/WaitDialog';

const CustomCard = ({items, loadingCard}) => {

    const itemsPerPage = 10
    const offset = items.length % itemsPerPage === 0 ? 0 : 1
    const lastPage = Math.floor(items.length / itemsPerPage + offset)
    const [currentPage, setCurrentPage] = useState(1)
    const [modalShow, setModalShow] = useState(false);
    const placeholders = [1, 2, 3]

    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState({txHash: ""})
    const [error, setError] = useState()

    let currentItems = items.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

    const { revokeAllowance } = useRevokeAllowance(callback, callbackError)

    function callback(item) {
        setResult({txHash: item.result.txhash})
        setLoading(false)
    }

    function callbackError(err) {
        setError(err)
        setLoading(false)
    }

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

    let body

    if (!loadingCard && currentItems.length > 0) {
        body = currentItems.map((item) => 
            (<tr key={item.id} className={"col-12"}>
                <td className={"col-2"}>{item.token}</td>
                <td className={"col-4 text-center"}>
                    <a href={"https://terrasco.pe/mainnet/address/" + item.spender}>{truncateAddress(item.spender)}</a>
                </td>
                <td className={"col-2 text-center"}>{item.allowance / 1000000}</td>
                <td className={"col-4 text-center"}> 
                    <a href = {"https://terrasco.pe/mainnet/blocks/" + item.expires}>{item.expires}</a>
                </td>
                <td className={"col-4 text-center"}>
                    <button className={"custom-btn text-white"} onClick={() => {
                        setError("")
                        setResult({txHash: ""})
                        revokeAllowance(item.address, item.allowance, item.spender)
                        setModalShow(true)
                    }}>Revoke</button>
                </td>
            </tr>))


    } else {
        body = placeholders.map((item) => (<tr key={item} className={"col-12"}>
            <td className={"col-2"}>
                <Skeleton/>
            </td>
            <td className={"col-4"}>
                <Skeleton/>
            </td>
            <td className={"col-2"}>
                <Skeleton/>
            </td>
            <td className={"col-4"}>
                <Skeleton/>
            </td>
            <td className={"col-4"}>
                <Skeleton/>
            </td>
        </tr>))
    }


    return (
        <Container className={"mt-4 col-sm-12 col-md-6"}>
            <Card className={"custom-card mt-5"}>
                <Card.Body>
                    {
                        !loadingCard && currentItems.length === 0 ? (<>
                            <div className={"text-center"}>It looks like you don't have any allowances.</div>
                        </>) : (<>
                            <Table borderless={true}>
                                <thead className={"custom-header"}>
                                    <tr className={"col-12"}>
                                        <th className={"col-2"}>Token</th>
                                        <th className={"col-4 text-center"}>Spender</th>
                                        <th className={"col-2 text-center"}>Allowance</th>
                                        <th className={"col-4 text-center"}>Expires</th>
                                        <th className={"col-4 text-center"}>Revoke</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {body}
                                </tbody>
                            </Table>
                        </>)
                    }
                </Card.Body>
            </Card>
            {!loadingCard && lastPage > 1 && <Pagination className="mt-2 pb-2 custom-pagination justify-content-center">
                {currentPage > 1 && <Pagination.Prev onClick={goToPreviousPage}/>}
                {currentPage > 2 && <Pagination.Item onClick={goToFirstPage}>{1}</Pagination.Item>}
                {currentPage > 2 && <Pagination.Ellipsis/>}
                {currentPage > 1 && <Pagination.Item onClick={goToPreviousPage}>{currentPage - 1}</Pagination.Item>}
                <Pagination.Item active>{currentPage}</Pagination.Item>
                {currentPage < lastPage && <Pagination.Item onClick={goToNextPage}>{currentPage + 1}</Pagination.Item>}
                {currentPage < lastPage - 1 && <Pagination.Ellipsis/>}
                {currentPage < lastPage - 1 && <Pagination.Item onClick={goToLastPage}>{lastPage}</Pagination.Item>}
                {currentPage < lastPage - 1 && <Pagination.Next onClick={goToNextPage}/>}
            </Pagination>}
            <WaitDialog show={modalShow} onHide={() => setModalShow(false)} loading = {loading} result = {result} error = {error}/>
        </Container>)
}
   

export default CustomCard;