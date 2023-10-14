import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import { useAuth } from "../Helpers/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "react-bootstrap";
import Nav from "react-bootstrap/Nav";
import Table from "react-bootstrap/Table";

const Dashboard = ({ currentUser }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState();
  const [checkedUsers, setCheckedUsers] = useState([]);
  const [allUserSelect, setAllUserSelect] = useState(false);

  const getAllUsers = async () => {
    try {
      const data = await axios.get(
        "https://task4-beckend.onrender.com/api/v1/users/getAllUsers"
      );
      setUsers(data.data.users);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  const updatingUser = async (id, status) => {
    if (status === "Active") {
      await axios.put(
        `https://task4-beckend.onrender.com/api/v1/users/updateUser/${id}`,
        {
          status: status,
        }
      );
    } else if (status === "Blocked") {
      await axios.put(
        `https://task4-beckend.onrender.com/api/v1/users/updateUser/${id}`,
        {
          status: status,
        }
      );
      if (checkedUsers.includes(currentUser._id)) {
        logout();
      }
    } else {
      await axios.delete(
        `https://task4-beckend.onrender.com/api/v1/users/deleteUser/${id}`
      );
      if (checkedUsers.includes(currentUser._id)) {
        logout();
      }
    }

    getAllUsers();
    setCheckedUsers([]);
  };

  const handleBlocking = () => {
    for (let i = 0; i < checkedUsers.length; i++) {
      updatingUser(checkedUsers[i], "Blocked");
    }
  };

  const handleUnlocking = () => {
    for (let i = 0; i < checkedUsers.length; i++) {
      updatingUser(checkedUsers[i], "Active");
    }
  };

  const handleDeleting = () => {
    for (let i = 0; i < checkedUsers.length; i++) {
      updatingUser(checkedUsers[i], "delete");
    }
  };

  return (
    <div>
      <Nav
        variant="pills"
        defaultActiveKey="/"
        className="justify-content-end dash-header">
        <Nav.Item>
          Hello{" "}
          <i>
            {currentUser.firstName} {currentUser.lastName}!
          </i>
        </Nav.Item>
        <Nav.Item>
          <Button
            variant="danger"
            onClick={(e) => {
              e.preventDefault();
              logout();
              navigate("/");
            }}>
            Log out
          </Button>
        </Nav.Item>
      </Nav>

      <div className="functional-btns">
        <Button variant="dark" onClick={() => handleBlocking()}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="1em"
            viewBox="0 0 448 512">
            <path d="M144 144v48H304V144c0-44.2-35.8-80-80-80s-80 35.8-80 80zM80 192V144C80 64.5 144.5 0 224 0s144 64.5 144 144v48h16c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V256c0-35.3 28.7-64 64-64H80z" />
          </svg>
          Block
        </Button>

        <Button variant="warning" onClick={() => handleUnlocking()}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="1em"
            viewBox="0 0 576 512">
            <path d="M352 144c0-44.2 35.8-80 80-80s80 35.8 80 80v48c0 17.7 14.3 32 32 32s32-14.3 32-32V144C576 64.5 511.5 0 432 0S288 64.5 288 144v48H64c-35.3 0-64 28.7-64 64V448c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V256c0-35.3-28.7-64-64-64H352V144z" />
          </svg>
        </Button>

        <Button variant="danger" onClick={() => handleDeleting()}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="1em"
            viewBox="0 0 448 512">
            <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" />
          </svg>
        </Button>
      </div>

      {users !== undefined ? (
        <div className="table-div">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th scope="col">
                  <input
                    type="checkbox"
                    checked={allUserSelect ? true : false}
                    onChange={() => {
                      if (allUserSelect) {
                        setCheckedUsers([]);
                      } else {
                        const newCheckedUsers = [...users.map((el) => el._id)];
                        setCheckedUsers(newCheckedUsers);
                      }
                      setAllUserSelect((a) => !a);
                    }}
                  />
                </th>
                <th scope="col">Name</th>
                <th scope="col">E-mail</th>
                <th scope="col">Last Login Time</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={checkedUsers.includes(user._id) ? true : false}
                      onChange={() => {
                        if (checkedUsers.includes(user._id)) {
                          const newCheckedUsers = checkedUsers.filter(
                            (u) => u !== user._id
                          );
                          setCheckedUsers(newCheckedUsers);
                        } else {
                          setCheckedUsers((s) => [...s, user._id]);
                        }
                      }}
                    />
                  </td>
                  <td>
                    {user.firstName} {user.lastName}
                  </td>
                  <td>{user.email}</td>
                  <td>{user.lastLogin}</td>
                  <td>{user.status}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default Dashboard;
