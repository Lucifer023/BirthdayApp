import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import LoggedInLayout from "../layouts/LoggedInLayout";
import AddItem from "../components/item/AddItem";
import ShowAllItems from "../components/item/ShowAllItems";
import ListOfUsersBirthdays from "../components/user/ListOfUsersBirthdays"

export const LoggedInUserRoutes = () => {
  return (
    <Routes>
      <Route
        path="/upcomingBirthdays"
        element={
          <LoggedInLayout>
            <ListOfUsersBirthdays />
          </LoggedInLayout>
        }
      />
      <Route
        path="/allItems"
        element={
          <LoggedInLayout>
            <ShowAllItems />
          </LoggedInLayout>
        }
      />
      <Route
        path="/addItem"
        element={
          <LoggedInLayout>
            <AddItem />
          </LoggedInLayout>
        }
      />
      <Route path="/*" element={<Navigate replace to="/upcomingBirthdays" />} />
    </Routes>
  );
};
