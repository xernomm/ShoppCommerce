import { icon } from '@fortawesome/fontawesome-svg-core';
import { Navbar, Nav, NavDropdown, Container, Form, Button } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import * as Icon from 'react-bootstrap-icons';
import Swal from 'sweetalert2';
import { useState, useEffect } from 'react';
import axios from 'axios';

function LogoutButton( {activePage} ) {

  const[userName, setUserName] = useState(null)
  const[userEmail, setUserEmail] = useState(null)

  useEffect(() => {
    const user = sessionStorage.getItem('loginFormData');
    console.log(user);
    if (user) {
      const parsedUser = JSON.parse(user);
      setUserEmail(parsedUser.email);
    }
  }, []);

  const sessionUser = JSON.parse(sessionStorage.getItem('loginFormData'));
  const token = sessionUser.token;

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const [userInfo, setUserInfo] = useState(null); 
  const [buyer, setBuyer] = useState(null); 
  const [shoppPay, setShoppPay] = useState(null)
  const [topUpReq, setTopUpReq] = useState([])
  const [orderHistory, setOrderHistory] = useState([])
  const[showAlert, setShowAlert] = useState(false)

  useEffect(() => {
    axios.get(`http://localhost:8080/shop/user-info/${sessionUser.email}`, { headers })
      .then((response) => {
        console.log(response.data)
        setUserInfo(response.data);
        setShowAlert(response.data.active === false)
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);



  const logout = () => {
    Swal.fire({
      title: 'Sign Out?',
      text: "All sessions will be cleared!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sign Out'
    }).then((result) => {
      if (result.isConfirmed) {
        sessionStorage.clear();
        window.localStorage.clear();
        
        Swal.fire(
          'Logged out!',
          'Your session has been cleared.',
          'success'
        ).then(() => {
          window.location.href = '/';
        });;
      }
    });
  };



  return (

<>
{userInfo && (
<NavDropdown className={`my-auto `} title={userEmail} id="collasible-nav-dropdown">
  <NavDropdown.Item className='teksprimary' href="/profile"><Icon.PersonFill className='icon'/> {userInfo.userDetails.name}</NavDropdown.Item>
  <NavDropdown.Item className='text-danger' onClick={() => logout()} href="#"><Icon.BoxArrowRight className='icon'/> Sign Out</NavDropdown.Item>
</NavDropdown>
)}

</>
    





  )
}

export default LogoutButton;