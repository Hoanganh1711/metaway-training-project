import { Layout } from 'antd';
import 'antd/dist/antd.css';
import "../../index.css"
import { Outlet } from 'react-router-dom';
import ManagerSidebar from './ManagerSidebar';

const { Content, Footer } = Layout;

const Manager = () => {
    return (
        <div>
            <Layout style={{ minHeight: '100vh' }}>
                <ManagerSidebar />
                <Layout className="site-layout">
                    <Content style={{ margin: '0 16px' }}>
                        <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
                            <Outlet />
                        </div>
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>
                        Metaway Hoding ©2018 Created by Ant UED
                    </Footer>
                </Layout>
            </Layout>
        </div>
    )
}

export default Manager