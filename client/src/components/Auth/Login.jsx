import React, { useState } from "react";
import logo from "../../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/authContext.jsx";
import Loading from "../Loading/Loading";

const Login = () => {
  const navigate = useNavigate();
  const { setIsLoggedIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("employee");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleUserTypeChange = (e) => setUserType(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const apiEndpoint =
      userType === "company"
        ? "https://felagi-jobs.onrender.com/api/company/login"
        : "https://felagi-jobs.onrender.com/api/users/login";

    try {
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      const userData =
        userType === "company" ? data.data.company : data.data.user;
      localStorage.setItem(
        "userData",
        JSON.stringify({
          user: {
            ...userData,
          },
          userType: userType,
          token: data.token,
        })
      );

      setIsLoggedIn(true);
      userType === "company"
        ? navigate("/control/dashboard-summary")
        : navigate("/job/job-list");
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("Failed to log in. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-96 p-8 bg-white rounded-lg shadow-md">
        <div className="flex items-center justify-center gap-2">
          <img src={logo} alt="logo" className="w-12" />
          <h1 className="text-2xl text-transparent bg-gradient-to-r from-green-600 to-gray-700 bg-clip-text">
            Felagi Jobs
          </h1>
        </div>
        {isLoading ? (
          <Loading />
        ) : (
          <>
            <h2 className="mt-4 mb-8 text-3xl font-bold text-center">Login</h2>

            <form onSubmit={handleSubmit}>
              <input
                type="email"
                className="w-full px-4 py-2 rounded-md border border-gray-300 mb-4"
                placeholder="Enter email"
                value={email}
                onChange={handleEmailChange}
              />
              <input
                type="password"
                className="w-full px-4 py-2 rounded-md border border-gray-300 mb-4"
                placeholder="Enter password"
                value={password}
                onChange={handlePasswordChange}
              />
              <div className="mb-4">
                <select
                  id="userType"
                  name="userType"
                  className="block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={userType}
                  onChange={handleUserTypeChange}
                >
                  <option value="employee">Employee</option>
                  <option value="company">Company</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full bg-[#328572] text-white py-2 rounded-md mt-4 hover:bg-[#32857290]"
                disabled={isLoading}
              >
                Login
              </button>
              {errorMessage && (
                <p className="text-red-500 text-sm mt-4">{errorMessage}</p>
              )}
            </form>
            <p className="text-gray-500 text-sm mt-4 text-center">
              Create account{" "}
              <span
                className="text-blue-500 cursor-pointer"
                onClick={() => navigate("/account/register")}
              >
                sign up
              </span>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
