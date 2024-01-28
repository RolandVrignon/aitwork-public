import { Paper } from "@mui/material";
import React, { useEffect, useState } from "react";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import PasswordIcon from "@mui/icons-material/Password";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import useRequest from "../../../../useRequest";

import Div100vh, { use100vh } from "react-div-100vh";

import NightsStayOutlinedIcon from "@mui/icons-material/NightsStayOutlined";
import Brightness4OutlinedIcon from "@mui/icons-material/Brightness4Outlined";

const Login = ({ navbarHeight, darkMode, toggleDarkMode }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formValid, setFormValid] = useState(false);
  const [error, setError] = useState("");

  const Request = useRequest();

  let hundred = use100vh();

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    setFormValid(event.target.value !== "" && password !== "");
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    setFormValid(email !== "" && event.target.value !== "");
  };

  const handleSubmit = async (event) => {
    if (!formValid) return;
    event.preventDefault();
    const obj = {
      email,
      password,
    };
    let res = await Request.Post("/website/user/login", obj);
    if (res.status === 401) {
      setError(res.message);
      return;
    }
    const newWebsiteToken = res.token;
    localStorage.setItem("websiteToken", newWebsiteToken);
    window.location.assign("/chat");
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
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
            <button type="submit">Se connecter</button>
            {error !== "" ? <p className="errormsg">{error}</p> : ""}
            <a href="/">mot de passe oublié</a>
          </form>
        </Paper>

        <div className="footer">
          <p>
            {" "}
            © All rights reserved -{" "}
            <a href="https://cogitum.io" target="_blanc" rel="noreferrer">
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
