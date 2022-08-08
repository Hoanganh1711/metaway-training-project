/* eslint-disable array-callback-return */
import {
    SearchOutlined,
    ExclamationCircleOutlined,
    SettingTwoTone
} from "@ant-design/icons";
import '../../index.css'
import { InputRef, Modal, Row, Select, message, Divider, Image } from "antd";
import { Button, Input, Space, Table, Spin } from "antd";
import type { ColumnsType, ColumnType } from "antd/lib/table";
import type { FilterConfirmProps } from "antd/lib/table/interface";
import React, { useEffect, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import "antd/dist/antd.css";
import axios from "axios";
import { Link } from "react-router-dom";
import type { TableRowSelection } from 'antd/es/table/interface';

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

    const [rolesName, setRolesName] = useState('')

    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const rowSelection: TableRowSelection<DataType> = {
        selectedRowKeys,
        onChange: onSelectChange,
        selections: [
            Table.SELECTION_ALL,
            Table.SELECTION_INVERT,
            Table.SELECTION_NONE,
        ],
    };

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
    }, []);

    console.log(usersList);


    //Thay đổi quyền của người dùng
    const handleSelectNewRoles = (e: any, row: any) => {
        confirm(e, row.id)
    }

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
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    };

    const showInfoModal = async (row: any) => {
        await axios.get(`https://heroku-done-all-manager.herokuapp.com/api/v1/user/views/list/${row.id}`,
            {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                },
            }
        )
            .then(response => {
                console.log(response);
                info(row);
            })
            .catch(error => {
                console.log(error);
            })
    }

    const info = (row: any) => {
        console.log("row", row);

        Modal.info({
            content: (
                <>
                    <div className="user-avatar">
                        {(typeof row.avt === "object") ?
                            <Image
                                style={{ borderRadius: "50%" }}
                                width="40%"
                                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmywnX8X85jiWUi9y_1ul_75WhF82V5yq41A&usqp=CAU"
                            />
                            :
                            <Image
                                style={{ borderRadius: "50%" }}
                                width="40%"
                                src={row.avt}
                            />
                        }
                    </div>
                    <Divider />
                    <div className="user-Info">
                        <Row className="user-info-item"><div><b>Họ tên:</b></div><div>{row.firstName} {row.lastName}</div></Row>
                        <Row className="user-info-item"><div><b>Vai trò:</b></div><div>{row.roles[0].name}</div></Row>
                        <Row className="user-info-item"><div><b>Email:</b></div><div>{row.email}</div></Row>
                        <Row className="user-info-item"><div><b>Số điện thoại:</b></div><div>{row.phoneNumber}</div></Row>
                        <Row className="user-info-item"><div><b>Địa chỉ:</b></div><div>{row.address}</div></Row>
                        <Row className="user-info-item"><div><b>Giới tính:</b></div><div>{row.gender ? row.gender : "---"}</div></Row>
                    </div>
                </>
            ),
            onOk() { },
        })
    };

    const showSettingModal = (row: any) => {
        alert(row.id)
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
            title: "ID",
            dataIndex: "id",
            key: "id",
            width: "10%",
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
            width: "30%",
            ...getColumnSearchProps("username"),
            render: (text: string, row: any) => {
                return (
                    <Row style={{ alignItems: "center" }}>
                        <Link onClick={() => showInfoModal(row)} key={row.id} to='#'>
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
            width: "30%",
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
                        {row.roles[0].name === "ROLE_ADMIN" ?
                            <Select style={{ width: 140 }} bordered={false} disabled defaultValue={rolesName} onChange={(e) => handleSelectNewRoles(e, row)}>
                                {rolesList.map((item: any) => {
                                    if (item.name === "ROLE_USER") {
                                        item.name = "Người dùng"
                                    } else if (item.name === "ROLE_MODERATOR") {
                                        item.name = "Cộng tác viên"
                                    } else if (item.name === "ROLE_ADMIN") {
                                        item.name = "Quản trị viên"
                                    }
                                    return (
                                        <Option key={item.id}>{item.name}</Option>
                                    )
                                })}
                            </Select>
                            :
                            <Select style={{ width: 140 }} bordered={false} defaultValue={rolesName} onChange={(e) => handleSelectNewRoles(e, row)}>
                                {rolesList.map((item: any) => {
                                    if (item.name === "ROLE_USER") {
                                        item.name = "Người dùng"
                                    } else if (item.name === "ROLE_MODERATOR") {
                                        item.name = "Cộng tác viên"
                                    } else if (item.name === "ROLE_ADMIN") {
                                        item.name = "Quản trị viên"
                                    }
                                    return (
                                        <Option key={item.id}>{item.name}</Option>
                                    )
                                })}
                            </Select>
                        }
                    </Row>
                );
            },
        },
        {
            title: "Điều chỉnh",
            dataIndex: "setting",
            key: "setting",
            width: "40%",
            ...getColumnSearchProps("fullName"),
            render: (index: any, row: any) => {
                return (
                    <Row onClick={() => showSettingModal(row)} style={{ alignItems: "center", cursor: 'pointer' }}>
                        <SettingTwoTone />
                    </Row>
                );
            },
        },
    ];

    return (
        <div>
            {
                !usersList ? (<Spin tip="Đang tải dữ liệu...">
                    <Table
                        rowKey={(items) => items.id}
                        rowSelection={rowSelection}
                        style={{ marginTop: 30 }}
                        columns={columns}
                        dataSource={usersList}
                    />
                </Spin>) : (
                    <Table
                        rowKey={(items) => items.id}
                        rowSelection={rowSelection}
                        style={{ marginTop: 30 }}
                        columns={columns}
                        dataSource={usersList}
                    />
                )
            }
        </div>
    )
};

export default UsersManager;