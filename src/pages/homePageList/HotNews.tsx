/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useState } from "react";
import { Col, Divider, List, Row, Space } from "antd";
import "../../index.css"
import { Link } from "react-router-dom";
import {
    setTitle,
    setContent,
    setAuthor,
    setPhoto,
} from "../../features/counter/counterSlice";
import { useAppDispatch } from "../../app/hooks";

const HotNews = () => {
    const [hotNewsList, setHotNewsList] = useState<any[]>([]);

    const hotNewsListAPI = async () => {
        const url = "https://heroku-done-all-manager.herokuapp.com/api/news/user/views";
        const response = await fetch(url);
        const newsData = await response.json();
        console.log(newsData);
        setHotNewsList(newsData);
    };

    useEffect(() => {
        hotNewsListAPI();
    }, []);

    const IconText = ({ icon, text }: any) => (
        <Space>
            {React.createElement(icon)}
            {text}
        </Space>
    );

    const dispatch = useAppDispatch();

    const handleClickGetShowNews = (hotNewsList: any, index: any) => {
        dispatch(setTitle(hotNewsList[index].title));
        dispatch(setContent(hotNewsList[index].content));
        dispatch(setAuthor(hotNewsList[index].author));
        dispatch(setPhoto(hotNewsList[index].photo));
    };

    return (
        <Col>
            <h2>Tin tức nổi bật</h2>
            {hotNewsList.map((item: any) => {
                let itemCategory = item.categories[0].name
                if (itemCategory === "POLITICAL") {
                    itemCategory = "Chính trị";
                } else if (itemCategory === "SOCIAL") {
                    itemCategory = "Xã hội";
                } else if (itemCategory === "ECONOMY") {
                    itemCategory = "Kinh tế";
                } else if (itemCategory === "HEALTH") {
                    itemCategory = "Sức khỏe";
                } else if (itemCategory === "EDUCATION") {
                    itemCategory = "Giáo dục";
                } else if (itemCategory === "LAW") {
                    itemCategory = "Pháp luật";
                } else if (itemCategory === "SPORT") {
                    itemCategory = "Thể thao";
                } else if (itemCategory === "WORLD") {
                    itemCategory = "Thế giới"
                }
                return (
                    <Col key={item.value}>
                        <Row className="news-container">
                            <Col span={5}>
                                <img style={{ width: "100%" }} src={item.img} />
                            </Col>

                            <Col span={19} className="news-items">
                                <h3 className="news-title">{item.title}</h3>
                                <p className="news-description">{item.description}</p>
                                <Divider className="divider"/>
                                <div>
                                    <span className="news-category">{itemCategory}</span>
                                </div>
                            </Col>
                        </Row>
                    </Col>
                )
            })}
        </Col>
    );
};

export default HotNews;

// function dispatch(arg0: { payload: any; type: string }) {
//   throw new Error("Function not implemented.");
// }
