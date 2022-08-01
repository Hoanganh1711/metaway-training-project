/* eslint-disable array-callback-return */
import {
    SearchOutlined,
    EditTwoTone,
    DeleteFilled,
    ExclamationCircleOutlined,
} from "@ant-design/icons";
import { Alert, InputRef, Modal, Row, Select, Tag } from "antd";
import { Button, Input, Space, Table } from "antd";
import type { ColumnsType, ColumnType } from "antd/lib/table";
import type { FilterConfirmProps } from "antd/lib/table/interface";
import React, { useEffect, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import "antd/dist/antd.css";
import axios from "axios";
import { Link } from "react-router-dom";
import { Spin } from 'antd';

const NewsManager = () => {
    interface DataType {
        id: any;
        key: React.Key;
        title: string;
        categories: [];
        status: boolean;
        date: string;
    }

    type DataIndex = keyof DataType;

    const [newsList, setNewsList] = useState<any[]>([]);
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const [categories, setCategories] = useState([]);

    const newsListAPI = () => {
        axios.get("https://heroku-done-all-manager.herokuapp.com/api/news/manager/views",
            {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                },
            }
        )
            .then(function (response) {
                console.log("response.data", response.data);
                // const newArray: any = []
                // response.data.forEach((element: any) => {
                //     const newObj = { ...element, key: element.id }
                //     newArray.push(newObj)
                // });
                // console.log({ newArray });
                setNewsList(response.data);
            })
            .catch(function (error) {
                console.log(error);
            });
    };

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
                console.log(response.data, 'Categories');
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
            render: (text: string, row) => {
                return (
                    <Row style={{ alignItems: "center" }}>
                        <Link key={row.id} to={{ pathname: `/Manager/check/news/${row.id}` }}>
                            {text}
                        </Link>
                    </Row>
                );
            },
        },
        {
            title: "Chủ đề",
            dataIndex: "categories",
            key: "categories",
            width: "20%",
            filters: categories.map((category: any) => ({
                text: category.name,
                value: category.name,
            })),
            onFilter: (value: any, record: any) => {
                console.log(record.categories, 'abctesting');

                return record.categories.find((category: any) => category.name === value)
            },
            render: (categories: []) => (
                <>
                    {categories.map((categorie: any, index: any) => {
                        let color = "";
                        if (categorie.name === "HOMEPAGE") {
                            color = "blue";
                        } else if (categorie.name === "POLITICAL") {
                            color = "cyan";
                        } else if (categorie.name === "SOCIAL") {
                            color = "red";
                        } else if (categorie.name === "ECONOMY") {
                            color = "yellow";
                        } else if (categorie.name === "HEALTH") {
                            color = "pink";
                        } else if (categorie.name === "EDUCATION") {
                            color = "orange";
                        } else if (categorie.name === "LAW") {
                            color = "geekblue";
                        } else if (categorie.name === "SPORT") {
                            color = "green";
                        } else if (categorie.name === "WORLD") {
                            color = "purple";
                        }
                        return <Tag color={color} key={index}>{categorie.name}</Tag>;
                    })}
                </>
            )
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
                    text: "Công khai",
                    value: true,
                },
                {
                    text: "Chờ duyệt",
                    value: false,
                },
            ],
            onFilter: (value: any, record) => {
                console.log(record, 'record testtest');
                return value ? record.status : !record.status
            },
            render: (status: string) => (
                <>{status ? <div key="public">Công khai</div> : <div key="hiding">Chờ duyệt</div>}</>
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

    return !newsList ? (<Spin tip="Đang tải dữ liệu...">
        <Table
            rowKey={(items) => items.id}
            style={{ marginTop: 30 }}
            columns={columns}
            dataSource={newsList}
        />
    </Spin>) : (
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
