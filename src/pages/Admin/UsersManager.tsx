/* eslint-disable array-callback-return */
import {
    SearchOutlined,
    ExclamationCircleOutlined,
    SettingTwoTone,
} from "@ant-design/icons";
import '../../index.css'
import { InputRef, Modal, Row, Select, message } from "antd";
import { Button, Input, Space, Table, Spin } from "antd";
import type { ColumnsType, ColumnType } from "antd/lib/table";
import type { FilterConfirmProps } from "antd/lib/table/interface";
import React, { useEffect, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import "antd/dist/antd.css";
import axios from "axios";
import { Link } from "react-router-dom";

const { Option } = Select;

const UsersManager = () => {
    interface DataType {
        id: number;
        key: React.Key;
        firstname: string;
        lastname: string;
        username: string;
        fullName: string;
        status: boolean;
        roles: [];
    }

    type DataIndex = keyof DataType;

    const [usersList, setUsersList] = useState<any[]>([]);
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("")

    const rolesList = [
        { id: 1, name: "ROLE_ADMIN" },
        { id: 2, name: "ROLE_MODERATOR" },
        { id: 3, name: "ROLE_USER" }
    ]

    const [newRolesID, setNewRolesId] = useState('')
    const [rolesName, setRolesName] = useState('')

    const [rowId, setRowId] = useState('')

    const usersAPI = () => {
        axios.get("https://heroku-done-all-manager.herokuapp.com/api/v1/user/views/list",
            {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                },
            }
        )
            .then(function (response) {
                // console.log("response.data", response.data);
                setUsersList(response.data)

                response.data.map((item: any) =>
                    item.fullName = item.firstName + " " + item.lastName,
                )

                response.data.map((item: any) => {
                    setRolesName(item.roles[0].name)
                })
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    useEffect(() => {
        usersAPI()
        console.log("test", rolesName)
    }, []);

    // Xóa một người dùng
    const deleteOneUser = (index: any, row: any) => {
        // console.log("row.id", row.id);

        // Modal.confirm({
        //     title: "Chắc chắn muốn xóa người dùng này ?",
        //     icon: <ExclamationCircleOutlined />,
        //     okType: "danger",
        //     onOk: () => {
        //         usersList.filter((data: any) => {
        //             axios
        //                 .delete(
        //                     `https://heroku-done-all-manager.herokuapp.com/api/v1/user/admin/${row.id}`,
        //                     {
        //                         headers: {
        //                             Authorization: "Bearer " + localStorage.getItem("token"),
        //                         },
        //                     }
        //                 )
        //                 .then(function (response) {
        //                     window.location.reload();
        //                     setUsersList(response.data);
        //                 })
        //                 .catch(function (error) {
        //                     console.log(error);
        //                 });
        //         });
        //     },
        //     cancelText: "Cancel",
        // });
    };

    //Thay đổi quyền của người dùng
    const handleSelectNewRoles = (e: any, row: any) => {
        setNewRolesId(e);
        setRowId(row.id)
        confirm(e, row.id)
    }

    console.log('newRolesID', newRolesID);
    console.log('rolesName', rolesName);
    console.log('rowId', rowId);

    const changerRolesSuccess = () => {
        message.success('Cập nhật thành công!');
    };

    const confirm = (e: any, id: any) => {
        Modal.confirm({
            title: 'Xác nhận thay đổi tư cách thành viên?',
            icon: <ExclamationCircleOutlined />,
            okText: 'OK',
            cancelText: 'Cancel',
            onOk: () => {
                axios.put(`https://heroku-done-all-manager.herokuapp.com/api/v1/user/update/${id}/roles`,
                    {
                        roles: [
                            {
                                id: e,
                                name: rolesName
                            }
                        ]
                    },
                    {
                        headers: {
                            Authorization: "Bearer " + localStorage.getItem("token"),
                        },
                    },
                )
                    .then(response => {
                        console.log(response);
                        changerRolesSuccess()
                    })
                    .catch(error => {
                        console.log(error);
                    })
            }
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
            ...getColumnSearchProps("id"),
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
            key: "fullName",
            width: "20%",
            ...getColumnSearchProps("fullName"),
            render: (text: string, row) => {
                return (
                    <Row style={{ alignItems: "center" }}>
                        {text}
                    </Row>
                );
            },
        },
        {
            title: "Tư cách thành viên",
            dataIndex: ['roles', '[0]', '[name]'],
            key: "roles",
            width: "20%",
            filters: [
                {
                    text: "Quản trị viên",
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
                return record.roles[0].name === value
            },
            render: (roles: string, row: any) => {
                console.log(row.id);
                let rolesName = row.roles[0].name
                if (rolesName === "ROLE_USER") {
                    rolesName = "Người dùng"
                } else if (rolesName === "ROLE_MODERATOR") {
                    rolesName = "Cộng tác viên"
                } else {
                    rolesName = "Quản trị viên"
                }
                return (
                    <Row style={{ alignItems: "center" }}>
                        <Select style={{ width: 130 }} defaultValue={rolesName} onChange={(e) => handleSelectNewRoles(e, row)}>
                            {rolesList.map((item: any) => {
                                if (item.name === "ROLE_USER") {
                                    item.name = "Người dùng"
                                } else if (item.name === "ROLE_MODERATOR") {
                                    item.name = "Cộng tác viên"
                                } else if (item.name === "ROLE_ADMIN") {
                                    item.name = "Quản trị viên"
                                }
                                return (
                                    <Option className='select-roles-option' key={item.id}>{item.name}</Option>
                                )
                            })}
                        </Select>
                    </Row>
                );
            },
        },
        {
            title: "Quản lý",
            dataIndex: "action",
            key: "action",
            width: "10%",
            render: (abc, row) => {
                return (
                    <Row style={{ alignItems: "center" }}>
                        <Button onClick={() => deleteOneUser(abc, row)} type="link">
                            <SettingTwoTone /> Điều chỉnh
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
