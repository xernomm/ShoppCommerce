import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons'
import Swal from 'sweetalert2';

function AllMessageAdmin(){

    const [messages, setMessages] = useState([]);
    const sessionUser = JSON.parse(sessionStorage.getItem('loginFormData')); // Get user data from sessionStorage
    const token = sessionUser.token;
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      },
    };


  useEffect(() => {
    axios.get('http://localhost:8080/shop/allContacts', config)
      .then(response => {
        setMessages(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);



  const handleDelete = (contactId) => {
    axios.delete(`http://localhost:8080/shop/deleteMessage/${contactId}`, config)
      .then(response => {
        Swal.fire('Deleted', 'Message has been deleted', 'success');
        setMessages(messages.filter(message => message.contactId !== contactId));
      })
      .catch(error => {
        console.error(error);
        Swal.fire('Error', 'An error occurred while deleting the message', 'error');
      });
  };


    return(
        <div className="body">
            <h1 className="display-6">All Messages</h1>
            <br />
            <div className="overflowContent px-3">
            {messages.map(message => (
            <div key={message.contactId} className="message loginBox mb-3">
                <div className='d-flex col-12 '>
                    <div className="col-9">
                    <p className="lead fw-bold mb-3">{message.email}</p>
                    <p className="lead">{message.message}</p>
                    </div>
                    <div className="col-3 my-auto">
                    <Button variant="" className="btn-danger col-10" onClick={() => handleDelete(message.contactId)}>
                  Delete <Icon.TrashFill className="mb-1" />
                </Button>
                    </div>
                </div>
                
            </div>
        ))}
            </div>
        </div>
    )
}

export default AllMessageAdmin;