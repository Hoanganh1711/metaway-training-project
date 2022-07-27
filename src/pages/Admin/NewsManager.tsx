/* eslint-disable array-callback-return */
import {
  SearchOutlined,
  EditTwoTone,
  DeleteFilled,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { InputRef, Modal, Row, Select, Tag } from "antd";
import { Button, Input, Space, Table } from "antd";
import type { ColumnsType, ColumnType } from "antd/lib/table";
import type { FilterConfirmProps } from "antd/lib/table/interface";
import React, { useEffect, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import "antd/dist/antd.css";
import axios from "axios";
import { Link } from "react-router-dom";

const { Option } = Select;

const NewsManager = () => {
  interface DataType {
    id: any;
    key: React.Key;
    title: string;
    categories: string[];
    status: string;
    date: string;
  }

  type DataIndex = keyof DataType;

  const [newsList, setNewsList] = useState<any[]>([]);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [categories, setCategories] = useState([]);

  const newsListAPI = () => {
    axios
      .get(
        "https://heroku-done-all-manager.herokuapp.com/api/news/manager/views",
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      )
      .then(function (response) {
        console.log(response.data);
        setNewsList(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  useEffect(() => {}, []);

  const categoriesAPI = () => {
    axios
      .get(
        "https://heroku-done-all-manager.herokuapp.com/api/category/manager/views",
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      )
      .then(function (response) {
        console.log(response.data);
        setCategories(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  useEffect(() => {
    newsListAPI();
    categoriesAPI();
  }, []);

  // Xóa bài viết
  const deleteOneNew = (index: any, row: any) => {
    Modal.confirm({
      title: "Chắc chắn muốn xóa bài viết này ?",
      icon: <ExclamationCircleOutlined />,
      okType: "danger",
      onOk: () => {
        newsList.filter((data: any) => {
          axios
            .delete(
              `https://heroku-done-all-manager.herokuapp.com/api/news/delete/${row.id}`,
              {
                headers: {
                  Authorization: "Bearer " + localStorage.getItem("token"),
                },
              }
            )
            .then(function (response) {
              window.location.reload();
              setNewsList(response.data);
            })
            .catch(function (error) {
              console.log(error);
            });
        });
      },
      cancelText: "Cancel",
    });
  };

  const searchInput = useRef<InputRef>(null);

  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: DataIndex
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (
    dataIndex: DataIndex
  ): ColumnType<DataType> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch(selectedKeys as string[], confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText((selectedKeys as string[])[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const columns: ColumnsType<DataType> = [
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      width: "20%",
      ...getColumnSearchProps("title"),
      render: (text: string) => <Link to="#">{text}</Link>,
    },
    {
      title: "Chủ đề",
      dataIndex: "categories",
      key: "categories",
      width: "20%",
      filters: categories.map((categorie: any) => ({
        text: categorie.name,
        value: categorie.name,
      })),
      onFilter: (value: any, record: any) =>
        record.categories.indexOf(value) === 0,
      render: (categories: []) => (
        <>
          {categories.map((categorie: any) => {
            let color = "";
            if (categorie.name === "HOMEPAGE") {
              color = "blue";
              categorie.name = "Trang chủ";
            } else if (categorie.name === "POLITICAL") {
              color = "cyan";
              categorie.name = "Chính trị";
            } else if (categorie.name === "SOCIAL") {
              color = "red";
              categorie.name = "Xã hội";
            } else if (categorie.name === "ECONOMY") {
              color = "yellow";
              categorie.name = "Kinh tế";
            } else if (categorie.name === "HEALTH") {
              color = "pink";
              categorie.name = "Sức khỏe";
            } else if (categorie.name === "EDUCATION") {
              color = "orange";
              categorie.name = "Giáo dục";
            } else if (categorie.name === "LAW") {
              color = "geekblue";
              categorie.name = "Pháp luật";
            } else if (categorie.name === "SPORT") {
              color = "green";
              categorie.name = "Thể thao";
            } else if (categorie.name === "WORLD") {
              color = "purple";
              categorie.name = "Thế giới";
            }
            return <Tag color={color}>{categorie.name}</Tag>;
          })}
        </>
      ),
    },
    {
      title: "Ngày đăng",
      dataIndex: "createdAt",
      key: "createdAt",
      width: "12%",
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: "12%",
      filters: [
        {
          text: "Chờ duyệt",
          value: "Chờ duyệt",
        },
        {
          text: "Công khai",
          value: "Công khai",
        },
      ],
      onFilter: (value: any, record: any) => record.status.indexOf(value) === 0,
      render: (status: string, record) => (
        <>{status ? <span>Chờ Duyệt</span> : <span>Công Khai</span>}</>
      ),
    },
    {
      title: "Xử lý",
      dataIndex: "action",
      key: "action",
      width: "20%",
      render: (abc, row) => {
        return (
          <Row style={{ alignItems: "center" }}>
            <Link key={row.id} to={{ pathname: `/manager/editNews/${row.id}` }}>
              <EditTwoTone /> Chỉnh sửa
            </Link>
            <Button onClick={() => deleteOneNew(abc, row)} type="link" danger>
              <DeleteFilled /> Xóa bỏ
            </Button>
          </Row>
        );
      },
    },
  ];

  return (
    <>
      <Table
        rowKey={(items) => items.id}
        style={{ marginTop: 30 }}
        columns={columns}
        dataSource={newsList}
      />
    </>
  );
};

export default NewsManager;
