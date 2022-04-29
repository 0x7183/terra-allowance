import {Modal, Spinner} from "react-bootstrap";
import {Button, Grid} from "@material-ui/core";
import {useState} from "react";
import './WaitDialog.css';
import truncateAddress from "../Utility";

export function WaitDialog({show, onHide, loading, result, error}) {

    
    const [showing, setShowing] = useState(true)

    let currentModal;

  
    const firstModal = <Modal
        show={show}
        onHide={onHide}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered>
        <Modal.Body className={"col-12"}>
            <div className={"col-12 p-5 text-center"}>
                <h3>Waiting for Terra Station...</h3>
            </div>
            <div className={"col-12 p-5 text-center"}>
                <Spinner animation={"border"}/>
            </div>
            <div className={"col-12 p-5 text-center"}>
                Transaction broadcasted. Please wait.
            </div>
        </Modal.Body>
    </Modal>

    const secondModal = <Modal
        onHide={onHide}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        show={showing}
        centered>
        <Modal.Body className={"col-12 custom-modal"}>
            <div className={"col-12 p-5 text-center"}>
                <h3>Complete!</h3>
            </div>
            <div className={"row col-12 p-2 justify-content-between"}>
                <div className={"col-6"}>
                    Tx Hash
                </div>
                <div className={"col-4"}>
                    <a href={"https://terrasco.pe/testnett/tx/" + result.txHash}>{truncateAddress(result.txHash)}</a>
                </div>
            </div>
            <Button variant={"contained"} className={"col-12 p-2 mt-3 button text-white"} onClick={() => {
                setShowing(false)
            }}>Ok</Button>
        </Modal.Body>
    </Modal>

    const errorModal = <Modal
        onHide={onHide}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        show={showing}
        centered>
        <Modal.Body className={"col-12 custom-modal"}>
            <div className={"col-12 p-5 text-center"}>
                <h3>Error!</h3>
            </div>
            <div className={"col-12"}>
                {error}
            </div>
            <Button variant={"contained"} className={"col-12 p-2 mt-3 button text-white"} onClick={() => {
                setShowing(false)
            }}>Ok</Button>
        </Modal.Body>
    </Modal>

    if (error) {
        currentModal = errorModal
    } else if (!loading && result.txHash) {
        currentModal = secondModal
    }  else  {
        currentModal = firstModal
    }

    return (currentModal);
}