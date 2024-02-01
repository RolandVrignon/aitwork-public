import { Paper } from "@mui/material";
import React, { useEffect, useState } from "react";
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import PasswordIcon from "@mui/icons-material/Password";
import KeyIcon from '@mui/icons-material/Key';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import CheckIcon from '@mui/icons-material/Check';
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import useRequest from "../../../../useRequest";

import Div100vh, { use100vh } from "react-div-100vh";

import NightsStayOutlinedIcon from "@mui/icons-material/NightsStayOutlined";
import Brightness4OutlinedIcon from "@mui/icons-material/Brightness4Outlined";

const Login = ({ navbarHeight, darkMode, toggleDarkMode }) => {
  const [company, setCompany] = useState("");
  const [license, setLicense] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checkPassword, setCheckPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showCheckPassword, setShowCheckPassword] = useState(false);
  const [formValid, setFormValid] = useState(false);
  const [error, setError] = useState("");
  const [disabled, setDisabled] = useState(false);

  const Request = useRequest();

  let hundred = use100vh();

  useEffect(() => {
    if (company !== "" && license !== "" && firstname !== "" && lastname !== "" && email !== "" && (password === checkPassword) && password !== "") {
      setFormValid(true);
    } else {
      setFormValid(false);
    }
  }, [company, license, firstname, lastname, email, password, checkPassword]);

  const handleCompanyChange = (event) => {
    setCompany(event.target.value);
  };

  const handleLicenseChange = (event) => {
    setLicense(event.target.value);
  };

  const handleFirstNameChange = (event) => {
    setFirstname(event.target.value);
  };

  const handleLastNameChange = (event) => {
    setLastname(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleCheckPasswordChange = (event) => {
    setCheckPassword(event.target.value);
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleShowCheckPassword = () => {
    setShowCheckPassword(!showCheckPassword);
  };


  const handleSubmit = async (event) => {
    if (!formValid) return;
    event.preventDefault();
    const obj = {
      company,
      license,
      firstname,
      lastname,
      email,
      password,
    };

    setDisabled(true);

    let res = await Request.Post("/website/user/register", obj);

    if (res.status === 401) {
      setError(res.message);
      setDisabled(false);
      return;
    }


    const newWebsiteToken = res.token;

    localStorage.setItem("websiteToken", newWebsiteToken);

    window.location.assign("/");
  };

  return (
    <>
      <Div100vh
        className="section login"
        style={{
          height: hundred ? `calc(${hundred}px - ${navbarHeight}px)` : "100vh",
        }}
      >
        <div className="lines">
          <div className="line"></div>
          <div className="line"></div>
          <div className="line"></div>
        </div>
        <Paper elevation={2} className="cardLogin">
          <div className="logo">
            {darkMode ? (
              <img
                src="https://ik.imagekit.io/z0tzxea0wgx/Cogitum/aitwork_baseline_darkmode_ZbC5OpB1t?updatedAt=1696434586106"
                alt="logo"
              />
            ) : (
              <img
                src="https://ik.imagekit.io/z0tzxea0wgx/Cogitum/aitwork_baseline_lightmode_wPPQqeb8w?updatedAt=1696434528275"
                alt="logo"
              />
            )}
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <div className="form-head">
                <WorkOutlineIcon className="icon" />
                <p htmlFor="company">Entreprise</p>
              </div>
              <input
                name="company"
                id="company"
                value={company}
                onChange={handleCompanyChange}
                placeholder="Entrez le nom de votre entreprise"
                required
              />
            </div>
            <div className="form-group">
              <div className="form-head">
                <KeyIcon className="icon" />
                <p htmlFor="company">License Iadopt</p>
              </div>
              <input
                name="license"
                id="license"
                value={license}
                onChange={handleLicenseChange}
                placeholder="Entrez votre clé iadopt-***********"
                required
              />
            </div>
            <div className="form-group">
              <div className="form-head">
                <PersonOutlineIcon className="icon" />
                <p htmlFor="firstName">Prénom</p>
              </div>
              <input
                type="firstName"
                name="firstName"
                id="firstName"
                value={firstname}
                onChange={handleFirstNameChange}
                placeholder="Entrez votre adresse e-mail"
                required
              />
            </div>
            <div className="form-group">
              <div className="form-head">
                <PersonOutlineIcon className="icon" />
                <p htmlFor="lastname">Nom de famille</p>
              </div>
              <input
                type="lastname"
                name="lastname"
                id="lastname"
                value={lastname}
                onChange={handleLastNameChange}
                placeholder="Entrez votre adresse e-mail"
                required
              />
            </div>
            <div className="form-group">
              <div className="form-head">
                <MailOutlineIcon className="icon" />
                <p htmlFor="email">email</p>
              </div>
              <input
                type="email"
                name="email"
                id="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="Entrez votre adresse e-mail"
                required
              />
            </div>
            <div className="form-group">
              <div className="pass">
                <div className="form-head">
                  <PasswordIcon className="icon" />
                  <p htmlFor="password">mot de passe</p>
                </div>
                {showPassword ? (
                  <VisibilityOffIcon
                    className="icon clickable"
                    onClick={handleShowPassword}
                  />
                ) : (
                  <VisibilityIcon
                    className="icon clickable"
                    onClick={handleShowPassword}
                  />
                )}
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                placeholder="Entrez votre mot de passe"
                value={password}
                onChange={handlePasswordChange}
                required
              />
            </div>


            <div className="form-group">
              <div className="pass">
                <div className="form-head">
                  <CheckIcon className="icon" />
                  <p htmlFor="checkPassword">Confirmez mot de passe</p>
                </div>
                {showCheckPassword ? (
                  <VisibilityOffIcon
                    className="icon clickable"
                    onClick={handleShowCheckPassword}
                  />
                ) : (
                  <VisibilityIcon
                    className="icon clickable"
                    onClick={handleShowCheckPassword}
                  />
                )}
              </div>
              <input
                type={showCheckPassword ? "text" : "password"}
                name="checkPassword"
                id="checkPassword"
                placeholder="Confirmez votre mot de passe"
                value={checkPassword}
                onChange={handleCheckPasswordChange}
                required
              />
            </div>


            <button type="submit" disabled={!formValid || disabled}>Créer son compte</button>
            {error !== "" ? <p className="errormsg">{error}</p> : ""}
            </form>
        </Paper>

        <div className="footer">
          <p>
            {" "}
            © All rights reserved -{" "}
            <a href="https://www.iadopt.fr" target="_blanc" rel="noreferrer">
              iadopt.
            </a>{" "}
            - {new Date().getFullYear()}
          </p>
        </div>
      </Div100vh>

      <div className="toggle-darkmode" onClick={toggleDarkMode}>
        {darkMode ? <Brightness4OutlinedIcon /> : <NightsStayOutlinedIcon />}
      </div>
    </>
  );
};

export default Login;
