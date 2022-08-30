import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Card, Typography, Switch, Button } from "antd";
import moment from "moment";
import { serviceConfig } from "../../appSettings/serviceConfig";
import { toast } from "react-toastify";
import { optionsErrorToast } from "../../helper/toastOptions";
import { Link } from "react-router-dom";

const AllAndOpenBirthdayEvents = () => {
  const [allBirthdayEvents, setAllBirthdayEvents] = useState([]);
  const [openBirthdayEvents, setOpenBirthdayEvents] = useState([]);
  const [isAllBirthdayEvents, setIsAllBirthdayEvents] = useState(true);
  const [allUsers, setAllUsers] = useState([]);
  const [allPresents, setAllPresents] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const { Title } = Typography;

  useEffect(() => {
    getAllBirthdayEvents();
    getOpenBirthdayEvents();
    getAllUsers();
    getAllPresents();
    getAllItems();
  }, []);

  const getAllBirthdayEvents = async () => {
    await axios
      .get(`${serviceConfig.baseURL}/birthdayEvents/allBirthdays`)
      .then((res) => {
        setAllBirthdayEvents(res.data);
      })
      .catch((err) => {
        toast.error(err.response.data.message, optionsErrorToast);
      });
  };

  const getOpenBirthdayEvents = async () => {
    await axios
      .get(`${serviceConfig.baseURL}/birthdayEvents/allOpenBirthdays`)
      .then((res) => {
        setOpenBirthdayEvents(res.data);
      })
      .catch((err) => {
        toast.error(err.response.data.message, optionsErrorToast);
      });
  };

  const getAllUsers = async () => {
    await axios
      .get(`${serviceConfig.baseURL}/users/allUsers`)
      .then((res) => {
        setAllUsers(res.data);
      })
      .catch((err) => {
        toast.error(err.response.data.message, optionsErrorToast);
      });
  };

  const getAllPresents = async () => {
    await axios
      .get(`${serviceConfig.baseURL}/presents/allPresents`)
      .then((res) => {
        setAllPresents(res.data);
      })
      .catch((err) => {
        toast.error(err.response.data.message, optionsErrorToast);
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

  const onChange = () => {
    setIsAllBirthdayEvents(!isAllBirthdayEvents);
  };

  const columns = [
    {
      title: "Birthday person",
      dataIndex: "birthdayPerson",
      key: "birthdayPerson",
      align: "center",
      render: (birthdaPerson, index) => {
        let birthdaPersonName;
        allUsers.map((user) => {
          if (user._id === birthdaPerson) {
            birthdaPersonName = user.name;
          }
        });
        return <p key={index}>{birthdaPersonName}</p>;
      },
    },
    {
      title: "Event creator",
      dataIndex: "eventCreator",
      key: "eventCreator",
      align: "center",
      render: (eventCreator, index) => {
        let eventCreatorName;
        allUsers.map((user) => {
          if (user._id === eventCreator) {
            eventCreatorName = user.name;
          }
        });
        return <p key={index}>{eventCreatorName}</p>;
      },
    },
    {
      title: "Total money amount",
      dataIndex: "totalMoneyAmount",
      key: "totalMoneyAmount",
      align: "center",
      render: (totalMoneyAmount, index) => {
        return <p key={index}>{totalMoneyAmount + " din."}</p>;
      },
    },
    {
      title: "Total collected amount",
      dataIndex: "totalCollectedAmount",
      key: "totalCollectedAmount",
      align: "center",
      render: (totalMoneyAmount, index) => {
        return <p key={index}>{totalMoneyAmount + " din."}</p>;
      },
    },
    {
      title: "Event date",
      dataIndex: "eventDate",
      key: "eventDate",
      align: "center",
      render: (eventDate, index) => {
        return <p key={index._id}>{moment(eventDate).format("DD.MM.YYYY")}</p>;
      },
    },
    {
      title: "Present bought",
      dataIndex: "_id",
      key: "_id",
      align: "center",
      render: (_id) => {
        let presentBought = []
        allPresents.map((present) => {
          if (present.birthdayEventId === _id) {
            allItems.map((item) => {
              if(present.presentBought === item._id)
              presentBought.push(item.name)
            })
          }
        });
        if(presentBought.length > 0 ){
          return <p>{presentBought}</p>
        } else {
          return <p className="no-participant" >Present still not bought</p>
        }
      },
    },
  ];


  const columnsWithoutPresent = columns.slice(0,5)

  const columnsForOpenBirthdayEvents = [
    ...columnsWithoutPresent,
    {
      title: "Add yourself as participant",
      dataIndex: "",
      key: "x",
      align: "center",
      render: (data) => {
        return (
          <Button type="primary">
            <Link
              state={data._id}
              to={{ pathname: `/addParticipantToBirthdayEvent/${data._id}` }}
            >
              Add
            </Link>
          </Button>
        );
      },
    },
    {
      title: "Buy present",
      dataIndex: "",
      key: "x",
      align: "center",
      render: (data) => {
        return (
          <Button type="primary">
            <Link state={data._id} to={{ pathname: `/buyPresent/${data._id}` }}>
              Add
            </Link>
          </Button>
        );
      },
    },
  ];

  return (
    <>
      <React.Fragment>
        <Card>
          <Title level={3}>
            {isAllBirthdayEvents
              ? "All Birthday Events"
              : "Open Birthday Events"}{" "}
            <Switch onChange={onChange} />
          </Title>
          <Table
            columns={
              isAllBirthdayEvents ? columns : columnsForOpenBirthdayEvents
            }
            expandable={{
              expandedRowRender: (record, index) => {
                let participantNames = [];
                allUsers.map((user) => {
                  for (let i = 0; i < record.participants.length; i++) {
                    if (user._id === record.participants[i]) {
                      participantNames.push(user.name);
                    }
                  }
                });
                if (participantNames.length !== 0) {
                  return (
                    <>
                      <p>Participants: </p>
                      <p key={index}>{participantNames.join(", ")}</p>
                    </>
                  );
                } else {
                  return (
                    <p key={index} className="no-participant">
                      No participants
                    </p>
                  );
                }
              },
            }}
            dataSource={
              isAllBirthdayEvents ? allBirthdayEvents : openBirthdayEvents
            }
            rowKey={(data) => data._id}
          ></Table>
        </Card>
      </React.Fragment>
    </>
  );
};

export default AllAndOpenBirthdayEvents;
