import axios from "axios";
import { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import Swal from "sweetalert2";
import * as Icon from "react-bootstrap-icons"
import { EditUserModalBuyer } from "./editUserModal";
import profileImg from '../../img/profile.jpg'
import store from '../../img/oneshop.jpg'


export const AdminSendVoucher = () => {
    const sessionUser = JSON.parse(sessionStorage.getItem('loginFormData'));
    const token = sessionUser.token;
  
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const headers = {
      Authorization: `Bearer ${token}`,
    };
  
    const [usersData, setUsersData] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:8080/shop/all-users`, { headers })
          .then((response) => {
            console.log(response.data)
            setUsersData(response.data);
          })
          .catch((error) => {
            console.error(error);
          });
      }, []);



    return(
        <>
        <div>
            <div className="body">
                <div className="d-flex justify-content-center">
                    <div className="col-10">
                        <div className="overflowContent2 px-5">
                        {usersData.map(user => (
                user.role !== "ADMIN" && user.role !== "SUPPLIER" && user.active === true &&(

            <div key={user.userId} className="loginBox py-2 mb-3 col-12">
                <div className='d-flex col-12'>
                    <div className="my-auto col-1">
                        <p className="lead fw-bold">
                            ID: {user.userId}
                        </p>
                    </div>
                    <div className="d-flex justify-content-center my-auto col-4">
                        {user.profilePicture && (
                            <img src={`data:image/jpeg;base64,${user.profilePicture}`} style={{ scale: "80%", borderRadius: "50%" }} className="col-12 profilePreview" alt="Preview" />
                        )}
                        {!user.profilePicture && user.role==="BUYER" &&(
                            <img src={profileImg} style={{ scale: "80%", borderRadius: "50%" }} className="col-12 profilePreview" alt="Preview" />
                        )}
                         {!user.profilePicture && user.role === "SUPPLIER" &&(
                            <img src={store} style={{ scale: "80%", borderRadius: "50%" }} className="col-12 profilePreview" alt="Preview" />
                        )}
                    </div>
                    <div className="col-3 my-auto">
                        <p className="lead mb-1 col-12"> {user.userDetails.name}</p>
                        <p className={`lead mb-1 col-12 ${user.role === 'SUPPLIER' ? 'teksprimary' : 'teksoren'}`}> {user.role}</p>
                    </div>
                    <div className="col-4 my-auto">
                        <Button href={`/addVoucher/${user.email}`} variant='' className='btn btnOren col-10 mx-auto mb-2' >Add voucher <Icon.CashStack className='mb-1' /></Button>
                    </div>
                </div>
            </div>
                )
        ))}
                        </div>
                    </div>
                </div>
            </div>

        </div>

        </>
    )
}