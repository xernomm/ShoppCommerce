import axios from "axios";
import { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import Swal from "sweetalert2";
import * as Icon from "react-bootstrap-icons"
import { EditUserModalBuyer } from "./editUserModal";
import profileImg from '../../img/profile.jpg'
import store from '../../img/oneshop.jpg'


export const AllUsers = () => {

    const sessionUser = JSON.parse(sessionStorage.getItem('loginFormData'));
  const token = sessionUser.token;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const [usersData, setUsersData] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
    
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



  const handleShowEditModal = (user) => {
      if (user) {
          setSelectedUser(user);
          setShowEditModal(true);
      }
  };

  const handleDeleteUser = (userId) => {
    axios.delete(`http://localhost:8080/shop/delete-user/${userId}`, { headers })
        .then(response => {
            Swal.fire({
                icon: 'success',
                title: 'User deleted',
                text: 'User deleted successfully',
              });
            setUsersData(prevUsersData => prevUsersData.filter(user => user.userId !== userId));
        })
        .catch(error => {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to delete user',
              });
            console.error(error);
        });
};
const handleSuspendUser = (userId) => {
    axios.put(`http://localhost:8080/shop/suspend/${userId}`, null, { headers })
        .then(response => {
            console.log(response.data);
            Swal.fire({
                icon: 'success',
                title: 'User suspended',
                text: 'User suspended successfully',
                preConfirm: () => {
                      window.location.reload();
                  },
            });
            setUsersData(prevUsersData => prevUsersData.filter(user => user.userId !== userId));
        })
        .catch(error => {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to suspend user',
            });
            console.error(error);
        });
};

const handleUnsuspendUser = (userId) => {
    axios.put(`http://localhost:8080/shop/un-suspend/${userId}`, null, { headers })
        .then(response => {
            console.log(response.data);
            Swal.fire({
                icon: 'success',
                title: 'User unsuspended',
                text: 'User unsuspended successfully',
                preConfirm: () => {
                    window.location.reload();
                },
            });
            setUsersData(prevUsersData => prevUsersData.filter(user => user.userId !== userId));
        })
        .catch(error => {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to unsuspend user',
            });
            console.error(error);
        });
};

    return(
        <div>
        <div className="body">
            <div className="d-flex justify-content-center">
                <div className="col-10">
                <h1 className="display-6 mb-4">Manage Users</h1>
        <br />
        <div className="overflowContent px-5">
                {usersData.map(user => (
                user.role !== "ADMIN" && user.active === true &&(

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
                        <Button variant='' className='btn btn-danger col-10 mx-auto mb-2' onClick={() => handleDeleteUser(user.userId)}>Delete <Icon.TrashFill className='mb-1' /></Button>
                        <br />
                        <Button variant='' className='btn btn-secondary col-10 mx-auto mb-2' onClick={() => handleSuspendUser(user.userId)}>Suspend <Icon.LockFill className='mb-1' /></Button>
                        <br />
                        <Button variant='' className='btnBiru col-10 mx-auto mb-2' onClick={() => handleShowEditModal(user)}>Edit  <Icon.Pencil className='mb-1' /></Button>
                    </div>
                </div>
            </div>
                )
        ))}


            {selectedUser && <EditUserModalBuyer show={showEditModal} onHide={() => setShowEditModal(false)} selectedUser={selectedUser} />}
        </div>

        <br />
        <h1 className="display-6 mb-4">Suspended Users</h1>
        <br />
        <div className="overflowContent px-5">
        {usersData.map(user => (
// Check if roleId is 2 before rendering the user
                user.role !== "ADMIN" && user.active === false &&(
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
                                <Button variant='' className='btn btn-danger col-10 mx-auto mb-2' onClick={() => handleDeleteUser(user.userId)}>Delete <Icon.TrashFill className='mb-1' /></Button>
                                <br />
                                <Button variant='' className='btn btn-success col-10 mx-auto mb-2' onClick={() => handleUnsuspendUser(user.userId)}>Activate <Icon.Lock className='mb-1' /></Button>
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
    )
}