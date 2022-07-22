import { SearchOutlined } from "@ant-design/icons";
import { InputRef, Select } from "antd";
import { Button, Input, Space, Table } from "antd";
import type { ColumnsType, ColumnType } from "antd/lib/table";
import type { FilterConfirmProps } from "antd/lib/table/interface";
import React, { useEffect, useId, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import "antd/dist/antd.css";
import axios from "axios";
import { Link } from "react-router-dom";

const { Option } = Select;

const NewsManager = () => {
  interface DataType {
    id: any;
    key: string;
    title: string;
    topic: string;
    date: string;
  }

  type DataIndex = keyof DataType;

  const [newsList, setNewsList] = useState<any[]>([]);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");

  const newsListAPI = () => {
    axios.get('https://heroku-done-all-manager.herokuapp.com/api/news/manager/views',
      {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem("token")
        }
      })
      .then(function (response) {
        console.log(response.data);
        setNewsList(response.data)
      })
      .catch(function (error) {
        console.log(error);
      })
  }
   
  useEffect(() => {
    newsListAPI();
  }, []);

  newsList.map(item => {
    console.log(item.status);
  })

  // Xóa bài viết
  const deleteOneNew = (index: any, row: any) => {
    newsList.filter((data) => {
      console.log(data.status);
      // const removeItem = data.id !== row.id;
      axios.delete(`https://heroku-done-all-manager.herokuapp.com/api/news/delete/${row.id}`,
        {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem("token")
          }
        })
        .then(function (response) {
          window.location.reload();
          setNewsList(response.data)
        })
        .catch(function (error) {
          console.log(error);
        })
    });
  };

  //Edit 

  const editModal = () => {
    
  }



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
      // eslint-disable-next-line jsx-a11y/anchor-is-valid
      render: (text: string) => <a href="#">{text}</a>,
    },
    {
      title: "Chủ đề",
      dataIndex: "topic",
      key: "topic",
      width: "20%",
      filters: [
        {
          text: "Chủ đề 1",
          value: "Chủ đề 1",
        },
        {
          text: "Chủ đề 2",
          value: "Chủ đề 2",
        },
        {
          text: "Chủ đề 3",
          value: "Chủ đề 3",
        },
      ],
      onFilter: (value: any, record: any) => record.topic.indexOf(value) === 0,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: "10%",
      filters: [
        {
          text: "Chờ duyệt",
          value: "Chờ duyệt",
        },
        {
          text: "Công khai",
          value: "Công khai",
        }
      ],
      onFilter: (value: any, record: any) => record.topic.indexOf(value) === 0,
    },
    {
      title: "Ngày đăng",
      dataIndex: "createdAt",
      key: "createdAt",
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Xử lý",
      dataIndex: "action",
      key: "action",
      render: (abc, row) => {
        console.log('abc', abc);
        console.log('row', row);
        
        return (
          <>
            <Link to={{
              pathname: `/Manager/EditNews/${row.id}`
            }}>Edit</Link>
            <Select defaultValue="Chờ duyệt" style={{ width: 100 }}>
              <Option key="pending" value="pending">Chờ duyệt</Option>
              <Option key="public" value="public">Công khai</Option>
            </Select>
            <Button onClick={() => deleteOneNew(abc, row)} type="link" danger>
              Remove
            </Button>
          </>
        );
      },
    },
  ];

  return (
    <>
      <Table
        style={{ marginTop: 30 }}
        columns={columns}
        dataSource={newsList}
      />
    </>
  );
};

export default NewsManager;