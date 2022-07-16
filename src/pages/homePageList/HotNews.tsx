import { EyeOutlined } from '@ant-design/icons'
import React, { useEffect, useState } from 'react'
import { MessageOutlined } from '@ant-design/icons';
import { List, Space } from 'antd';
import "C:/Users/Admin/Desktop/news-manager/src/index.css"

const HotNews = () => {

    const [newsList, setNewsList] = useState<any[]>([])

    const newsListAPI = async () => {
        const url = 'https://heroku-manager-news.herokuapp.com/api/test/all'
        const response = await fetch(url)
        const newsData = await response.json()
        console.log(newsData);
        setNewsList(newsData)
    }

    useEffect(() => {
        newsListAPI()
    }, [])

    const IconText = ({ icon, text }: any) => (
        <Space>
            {React.createElement(icon)}
            {text}
        </Space>
    );


    return (
        <div style={{ margin: "50px auto", width: 900 }}>
            <p style={{ fontSize: 24, fontWeight: 500 }}>Tin tức nổi bật</p>
            <>
                <List
                    className='hot-news-list'
                    style={{ backgroundColor: "#fff", padding: 15 }}
                    itemLayout="vertical"
                    size="large"
                    pagination={{
                        onChange: (page) => {
                            console.log(page);
                        },
                        pageSize: 3,
                    }}
                    dataSource={newsList}
                    renderItem={(item, index) => (
                        <List.Item
                            key={item.id}
                            actions={[
                                <IconText icon={EyeOutlined} text={newsList[index].views} key="list-vertical-star-o" />,
                                <IconText icon={MessageOutlined} text="2" key="list-vertical-message" />,
                            ]}
                            extra={
                                <img
                                    width={200}
                                    alt="logo"
                                    src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
                                />
                            }
                        >
                            <List.Item.Meta
                                title={<a href={item.href}>{item.title}</a>}
                                description={item.description}
                            />
                            {/* {item.content} */}
                        </List.Item>
                    )}
                />
            </>
        </div >
    )
}

export default HotNews