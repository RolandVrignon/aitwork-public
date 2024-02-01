import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Loading from "./components/website/root/loading/loading";
import Login from "./components/website/form/login/login";
import Register from "./components/website/form/register/register";
import CogiPro from "./components/dashboard/CogiProducts/cogipro.jsx";
import CogiWelcome from "./components/dashboard/CogiProducts/cogiwelcome.jsx";
import useRequest from "./useRequest";
import Dashboard from "./components/dashboard/dashboard";
import jwt_decode from "jwt-decode";
import SharedChat from "./components/shared/sharedChat";

function Wrapper({
  darkMode,
  toggleDarkMode,
  loading,
  hasUsers,
}) {

  return (
    <div className={`App ${darkMode ? "dark-mode" : "light-mode"}`}>
      {loading ? <Loading darkMode={darkMode} /> : null}
      <Routes>
        { hasUsers ? (
          <Route
            path="/"
            element={
              <Login
                darkMode={darkMode}
                toggleDarkMode={toggleDarkMode}
              />
            }
          />
        ) : (
          <Route
            path="/"
            element={
              <Register
                darkMode={darkMode}
                toggleDarkMode={toggleDarkMode}
              />
            }
          />
        )}
        <Route
          path="/dashboard"
          element={
            <Dashboard
              darkMode={darkMode}
              toggleDarkMode={toggleDarkMode}
            />
          }
        />
        <Route
          path="/chat"
          element={
            <CogiPro darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          }
        />
        <Route
          path="/onboarding"
          element={
            <CogiWelcome darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          }
        />
        <Route
          path="/shared/:id"
          element={
            <SharedChat darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          }
        />
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </div>
  )
}

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [loading] = useState(true);
  const [hasUsers, setHasUsers] = useState(false);

  const Request = useRequest();


  async function checkUsers(token){
    try {
      const res = await Request.Get("public/user/hasusers");
      setHasUsers(res.hasUsers);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleToken() {
    const storedToken = localStorage.getItem("websiteToken");

    if (storedToken) {
      try {
        const decodedToken = jwt_decode(storedToken);
        const res = await Request.Get("/website/token");
        if (!res.type) {
          localStorage.removeItem("websiteToken");
          window.location.assign("/");
        } else {
          if (window.location.pathname === "/") {
            window.location.assign("/chat");
          }
        }
        if (decodedToken.exp * 1000 > Date.now()) {
          return;
        }
      } catch (error) {
        console.error(error);
      }
      localStorage.removeItem("websiteToken");
    } else {
      try {
        const res = await Request.Get("/public/token");
        const newWebsiteToken = res.websiteToken;
        localStorage.setItem("websiteToken", newWebsiteToken);
        while (!localStorage.getItem("websiteToken")) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
        await checkUsers();
        return newWebsiteToken;
      } catch (error) {
        console.error("Error fetching token:", error);
        throw error;
      }
    }
  }

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        const newToken = await handleToken();
        if (isMounted && newToken) {
          await checkUsers(newToken);
        }
      } catch (error) {
        console.error(error);
      }
    })();

    return () => {
      isMounted = false;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const storedDarkMode = localStorage.getItem("darkMode");
    if (storedDarkMode !== null) {
      setDarkMode(storedDarkMode === "true");
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("darkMode", newDarkMode ? "true" : "false");
  };

  return (
    <Router>
      <Wrapper
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        loading={loading}
        hasUsers={hasUsers}
      />
    </Router>
  );
}

export default App;