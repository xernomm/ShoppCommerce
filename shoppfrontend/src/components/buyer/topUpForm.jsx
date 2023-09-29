import axios from "axios"
import React, {useState, useEffect} from "react"
import { Button, Form, FormControl, Modal } from "react-bootstrap"
import Swal from "sweetalert2"
import * as Icon from "react-bootstrap-icons"
import { PayPalforTopUp } from "../../utils/payPalTopUp"


export const TopUpForm = () => {

    const sessionUser = JSON.parse(sessionStorage.getItem('loginFormData'));
    const token = sessionUser.token;
  
    const headers = {
      Authorization: `Bearer ${token}`,
    };



    const [topUpData, setTopUpData] = useState({
        balance: '',
        description: '',
      });

    const [topUpReq, setTopUpReq] = useState(null)

      useEffect(() => {
        if(topUpData != null){
            axios.get(`http://localhost:8080/shop/top-up-requests/${sessionUser.email}`, { headers })
            .then((response) => {
              console.log(response.data)
              setTopUpReq(response.data);
            })
            .catch((error) => {
              console.error(error);
            })
        }
      }, []);

    const handleTopUp = (e) => {
        e.preventDefault()

        axios
        .post(`http://localhost:8080/shop/top-up?email=${sessionUser.email}`, topUpData, { headers })
        .then((response) => {
          console.log(response.data);
          setTopUpData(response.data);
          setShowModal(true)

        })
        .catch((error) => {
            if (error.response.data.message === 'Balance cannot be 0.') {
                Swal.fire({
                  icon: 'error',
                  title: 'Balance cannot be empty',
                  text: 'Please input a balance value',
                });
              }
          console.error(error.response);
        });
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTopUpData((prevData) => ({ ...prevData, [name]: value }));
      };

      
      const [showModal, setShowModal] = useState(false);

      const handleShowModal = () => {
      setShowModal(true);
      };

      const handleCloseModal = () => {
      setShowModal(false);
      };

    return(
        <div className="col-12">
            <Form onSubmit={handleTopUp}>
                <Form.Floating className="mb-3">
                    <FormControl 
                    type="number"
                    id="balance"
                    name="balance"
                    placeholder="Input Balance"
                    value={topUpData.balance}
                    onChange={handleChange}

                    />
                    <label htmlFor="">Input Balance</label>
                </Form.Floating>

                <Form.Floating className="mb-3">
                    <FormControl 
                    type="text"
                    id="description"
                    name="description"
                    placeholder="Description (Optional)"
                    value={topUpData.description}
                    onChange={handleChange}

                    />
                    <label htmlFor="">Description (Optional)</label>
                </Form.Floating>


                <Button type="submit" className="col-6 btnOren">
                    Top up
                </Button>
            </Form>


            <Modal show={showModal} onHide={handleCloseModal}>
            <Modal.Header closeButton>
                <p className="lead"> How would you like to pay?</p>
            </Modal.Header>
            <Modal.Body className="p-5">
                <p className="lead mb-4">Select payment method</p>
                {topUpData && (
                  <>
                    <PayPalforTopUp topUpId={topUpData.topUpId}/>
                  </>

                )}
                <div className="d-flex col-12">
                    <div className="col-5">
                        <hr />
                    </div>
                    <div className="col-2">
                        <p className="lead text-center">or</p>
                    </div>
                    <dov className="col-5">
                        <hr />
                    </dov>
                </div>
                <Button variant="" className="btn-secondary col-12 mb-2">Cash on Delivery <Icon.CashStack className="mb-1" /> </Button>
                <Button variant="" className="btnBiru col-12 mb-2">Mobile banking <Icon.PhoneFill className="mb-1" /> </Button>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="outline-danger" className='' onClick={handleCloseModal}>Cancel</Button>
            </Modal.Footer>
        </Modal>


        </div>
    )
}