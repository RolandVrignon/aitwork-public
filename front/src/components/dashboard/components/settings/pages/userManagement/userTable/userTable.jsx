import React from "react";

const userTable = ({ users, getTeamName, handleState }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>
            <div className="text">First Name</div>
          </th>
          <th>
            <div className="text">Last Name</div>
          </th>
          <th>
            <div className="text">Email</div>
          </th>
          <th>
            <div className="text">Role</div>
          </th>
          <th>
            <div className="text">Equipe</div>
          </th>

        </tr>
      </thead>
      <tbody>
        {users.map((user, index) => (
          <tr key={index} onClick={() => handleState('userSelected', user)}>
            <td>
              <div className="text">{user.firstName}</div>
            </td>
            <td>
              <div className="text">{user.lastName}</div>
            </td>
            <td>
              <div className="text">{user.email}</div>
            </td>
            <td>
              <div className="text">{user.role}</div>
            </td>
            <td>
              <div className="text">{getTeamName(user.team)}</div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default userTable;
