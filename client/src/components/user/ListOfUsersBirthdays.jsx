import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Card, Typography } from "antd";
import moment from "moment";
import { serviceConfig } from "../../appSettings/serviceConfig";
import { toast } from "react-toastify";
import { optionsErrorToast } from "../../helper/toastOptions";

function ListOfUsersBirthdays() {
  const [usersWithUpcomingBirthdays, setUsersWithUpcomingBirthdays] = useState(
    []
  );
  const [allItems, setAllItems] = useState([]);
  const { Title } = Typography;

  useEffect(() => {
    getAllUpcomingBirthdays();
    getAllItems();
  }, []);

  const getAllUpcomingBirthdays = async () => {
    await axios
      .get(`http://localhost:5000/users/upcomingBirthdays`)
      .then((res) => {
        const usersBirthdays = res.data;
        setUsersWithUpcomingBirthdays(usersBirthdays);
      });
  };

  const getAllItems = async () => {
    await axios
      .get(`${serviceConfig.baseURL}/items/getAllItems`)
      .then((res) => {
        setAllItems(res.data);
      })
      .catch((err) => {
        toast.error(err.response.data.message, optionsErrorToast);
      });
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      align: "center",
    },
    {
      title: "Birth date",
      dataIndex: "birthDate",
      key: "birthDate",
      align: "center",
      render: (birthDate, index) => {
        return <p key={index._id}>{moment(birthDate).format("DD.MM.YYYY")}</p>;
      },
    },
  ];

  return (
    <>
      <React.Fragment>
        <Card>
          <Title level={3}>Upcoming birthdays</Title>
          <Table
            columns={columns}
            expandable={{
              expandedRowRender: (record, index) => {
                let itemNames = [];
                allItems.map((item) => {
                  for (let i = 0; i < record.wishlist.length; i++) {
                    if (item._id === record.wishlist[i]) {
                      itemNames.push(item.name);
                    }
                  }
                });
                return (
                  <>
                    <p>Wish list: </p>
                    <p key={index._id}>{itemNames.join(", ")}</p>
                  </>
                );
              },
            }}
            dataSource={usersWithUpcomingBirthdays}
            rowKey={(data) => data._id}
          ></Table>
        </Card>
      </React.Fragment>
    </>
  );
}

export default ListOfUsersBirthdays;
