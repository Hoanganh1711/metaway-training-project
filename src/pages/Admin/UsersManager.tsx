/* eslint-disable array-callback-return */
import {
    SearchOutlined,
    DeleteFilled,
    ExclamationCircleOutlined,
} from "@ant-design/icons";
import { Alert, InputRef, Modal, Row, Select } from "antd";
import { Button, Input, Space, Table } from "antd";
import type { ColumnsType, ColumnType } from "antd/lib/table";
import type { FilterConfirmProps } from "antd/lib/table/interface";
import React, { useEffect, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import "antd/dist/antd.css";
import axios from "axios";
import { Link } from "react-router-dom";
import { Spin } from 'antd';
import { getRoles } from "@testing-library/react";

const UsersManager = () => {
    interface DataType {
        id: number;
        key: React.Key;
        firstname: string;
        lastname: string;
        username: string;
        status: boolean;
        roles: [];
    }

    type DataIndex = keyof DataType;

    const [usersList, setUsersList] = useState<any[]>([]);
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");

    const usersAPI = () => {
        axios.get("https://heroku-done-all-manager.herokuapp.com/api/v1/user/views/list",
            {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                },
            }
        )
            .then(function (response) {
                console.log("response.data", response.data);
                response.data.map((item: any) =>
                    item.fullName = item.lastName + " " + item.firstName,
                )
                setUsersList(response.data)
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    useEffect(() => {
        usersAPI();
    }, []);


    // Xóa một người dùng
    const deleteOneUser = (index: any, row: any) => {
        Modal.confirm({
            title: "Chắc chắn muốn xóa người dùng này ?",
            icon: <ExclamationCircleOutlined />,
            okType: "danger",
            onOk: () => {
                usersList.filter((data: any) => {
                    axios
                        .delete(
                            `https://heroku-done-all-manager.herokuapp.com/api/v1/user/admin/${row.id}`,
                            {
                                headers: {
                                    Authorization: "Bearer " + localStorage.getItem("token"),
                                },
                            }
                        )
                        .then(function (response) {
                            window.location.reload();
                            setUsersList(response.data);
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
            title: "ID",
            dataIndex: "id",
            key: "id",
            width: "5%",
            ...getColumnSearchProps("username"),
            render: (text: string, row) => {
                return (
                    <Row style={{ alignItems: "center" }}>
                        {text}
                    </Row>
                );
            },
        },
        {
            title: "Tên truy cập",
            dataIndex: "username",
            key: "username",
            width: "20%",
            ...getColumnSearchProps("username"),
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
            title: "Tên đầy đủ",
            dataIndex: "fullName",
            key: "fullname",
            width: "20%",
            ...getColumnSearchProps("username"),
            render: (text: string, row) => {
                return (
                    <Row style={{ alignItems: "center" }}>
                        {text}
                    </Row>
                );
            },
        },
        {
            title: "Chức vụ",
            dataIndex: ['roles', '[0]', '[name]'],
            key: "roles",
            width: "20%",
            filters: [
                {
                    text: "Admin",
                    value: "ROLE_ADMIN",
                },
                {
                    text: "Cộng tác viên",
                    value: "ROLE_MODERATOR",
                },
                {
                    text: "Người dùng",
                    value: "ROLE_USER",
                },
            ],
            onFilter: (value: any, record: any) => {
                console.log(record, 'record testtest');
                return value ? record.name : !record.name
            },
            render: (roles: string, row: any) => {
                let rolesName = row.roles[0].name
                if (rolesName === "ROLE_USER") {
                    rolesName = "Người dùng"
                } else if (rolesName === "ROLE_MODERATOR") {
                    rolesName = "Cộng tác viên"
                } else {
                    rolesName = "Admin"
                }

                return (
                    <span>
                        {rolesName}
                    </span>
                );
            },
        },
        // {
        //     title: "Trạng thái",
        //     dataIndex: "status",
        //     key: "status",
        //     width: "12%",
        //     filters: [
        //         {
        //             text: "Công khai",
        //             value: true,
        //         },
        //         {
        //             text: "Chờ duyệt",
        //             value: false,
        //         },
        //     ],
        //     onFilter: (value: any, record) => {
        //         console.log(record, 'record testtest');
        //         return value ? record.status : !record.status
        //     },
        //     render: (status: string) => (
        //         <>{status ? <div key="public">Công khai</div> : <div key="hiding">Chờ duyệt</div>}</>
        //     ),
        // },
        {
            title: "Xử lý",
            dataIndex: "action",
            key: "action",
            width: "10%",
            render: (abc, row) => {
                return (
                    <Row style={{ alignItems: "center" }}>
                        <Button onClick={() => deleteOneUser(abc, row)} type="link" danger>
                            <DeleteFilled />
                        </Button>
                    </Row>
                );
            },
        },
    ];

    return !usersList ? (<Spin tip="Đang tải dữ liệu...">
        <Table
            rowKey={(items) => items.id}
            style={{ marginTop: 30 }}
            columns={columns}
            dataSource={usersList}
        />
    </Spin>) : (
        <>
            <Table
                rowKey={(items) => items.id}
                style={{ marginTop: 30 }}
                columns={columns}
                dataSource={usersList}
            />
        </>
    );
};

export default UsersManager;
