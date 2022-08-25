import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import LoggedInLayout from "../layouts/LoggedInLayout";
import AddItem from "../components/item/AddItem";
import ShowAllItems from "../components/item/ShowAllItems";
import ListOfUsersBirthdays from "../components/user/ListOfUsersBirthdays";
import WishListOfLoggedUser from "../components/item/WishListOfLoggedUser";
import AllAndOpenBirthdayEvents from "../components/birthdayEvent/AllAndOpenBirthdayEvents";
import AddParticipantToBirthdayEvent from "../components/birthdayEvent/AddParticipantToBirthdayEvent";
import CreateBirthdayEvent from "../components/birthdayEvent/CreateBirthdayEvent";

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
        path="/allAndOpenBirthdayEvents"
        element={
          <LoggedInLayout>
            <AllAndOpenBirthdayEvents />
          </LoggedInLayout>
        }
      />
      <Route
        path="/createBirthdayEvent"
        element={
          <LoggedInLayout>
            <CreateBirthdayEvent />
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
        path="/myWishList"
        element={
          <LoggedInLayout>
            <WishListOfLoggedUser />
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
      <Route
        path="/addParticipantToBirthdayEvent/:id"
        element={
          <LoggedInLayout>
            <AddParticipantToBirthdayEvent />
          </LoggedInLayout>
        }
      />
      <Route path="/*" element={<Navigate replace to="/upcomingBirthdays" />} />
    </Routes>
  );
};
