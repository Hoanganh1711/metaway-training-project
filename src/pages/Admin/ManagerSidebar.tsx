import {
    FormOutlined,
    UserOutlined,
    HomeFilled,
    IdcardOutlined,
    FileSearchOutlined
} from '@ant-design/icons';
import { Image } from 'antd';
import 'antd/dist/antd.css';
import '../../index.css'
import { Layout, Menu } from 'antd';
import { useState } from 'react';
import { Link, NavLink, useLocation } from "react-router-dom";
const { Sider } = Layout;

const ManagerSidebar = () => {

    const [collapsed, setCollapsed] = useState(false);
    const location = useLocation();

    const items = [
        {
            key: "home",
            icon: <HomeFilled />,
            title: "Trang chủ",
            link: "/"
        },
        {
            key: "userManagement",
            title: "Admin",
            children: [
                {
                    key: "AdminInfo",
                    icon: <IdcardOutlined />,
                    title: "Thông tin cá nhân",
                    link: "./UsersInfo"
                },
                {
                    key: "manager",
                    icon: <FileSearchOutlined />,
                    title: "Quản lý tin tức",
                    link: "./NewsManager"
                },
                {
                    key: "form",
                    icon: <FormOutlined />,
                    title: "Đăng tin",
                    link: "./CreateNewsForm"
                },
                
                // {
                //     key: "NewsManager",
                //     icon: <SnippetsOutlined />,
                //     title: "Quản lý bài viết",
                //     link: "./NewsManager"
                // },
                // {
                //     key: "NewsManager",
                //     icon: <TeamOutlined />,
                //     title: "Quản lý người dùng",
                //     link: "./NewsManager"
                // },
            ]
        },
    ];

    return (
        <>
            <Sider collapsible collapsed={collapsed} onCollapse={value => setCollapsed(value)}>
                <Menu theme="dark" defaultSelectedKeys={[location.pathname]} mode="inline">
                    <Image style={{ width: "60%", marginLeft: 20 }} src='https://cdn.logo.com/hotlink-ok/logo-social.png'/>
                    {items.map((item) =>
                        !item.children ? (
                            <Menu.Item key={item.key}>
                                <NavLink className="d-flex align-items-center" to={item.link}>
                                    {item.icon}
                                    <span>{item.title}</span>
                                </NavLink>
                            </Menu.Item>
                        ) : (
                            <Menu.SubMenu key={item.key} title={item.title} icon={<UserOutlined />}>
                                {item.children.map((child) =>
                                    <Menu.Item key={child.key}>
                                        <Link className="d-flex align-items-center" to={child.link}>
                                            {child.icon}
                                            <span>{child.title}</span>
                                        </Link>
                                    </Menu.Item>
                                )}
                            </Menu.SubMenu>
                        )
                    )}
                </Menu>
            </Sider>
        </>
    )
}

export default ManagerSidebar