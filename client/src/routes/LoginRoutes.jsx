import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Login from "../components/user/Login";
import LoginLayout from "../layouts/LoginLayout";

const LoginRoutes = () => {
  return (
      <Routes>
        <Route
          path="/login"
          element={
            <LoginLayout>
              <Login />
            </LoginLayout>
          }
        />
        <Route path="/*" element={<Navigate replace to='/login' />} />
      </Routes>
  );
};

export default LoginRoutes;
