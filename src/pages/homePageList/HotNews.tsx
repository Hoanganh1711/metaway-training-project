/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useState } from "react";
import { Col, Row, Image, Card } from "antd";
import "../../index.css"
import { Link } from "react-router-dom";
import {
    setTitle,
    setContent,
    setAuthor,
    setPhoto,
} from "../../features/counter/counterSlice";
import { useAppDispatch } from "../../app/hooks";
// import { EyeOutlined, MessageOutlined } from "@ant-design/icons";
// import Meta from "antd/lib/card/Meta";

const HotNews = () => {
    const [hotNewsList, setHotNewsList] = useState<any[]>([]);

    const hotNewsListAPI = async () => {
        const url = "https://heroku-done-all-manager.herokuapp.com/api/news/user/views";
        const response = await fetch(url);
        const newsData = await response.json();
        setHotNewsList(newsData);
    };

    useEffect(() => {
        hotNewsListAPI();
    }, []);

    // const IconText = ({ icon, text }: any) => (
    //     <Space>
    //         {React.createElement(icon)}
    //         {text}
    //     </Space>
    // );

    const dispatch = useAppDispatch();

    const handleClickGetShowNews = (hotNewsList: any, index: any) => {
        dispatch(setTitle(hotNewsList[index].title));
        dispatch(setContent(hotNewsList[index].content));
        dispatch(setAuthor(hotNewsList[index].author));
        dispatch(setPhoto(hotNewsList[index].photo));
    };

    return (
        <div>
            <h2>
                <Link to="#" className="news-list-heading">Tin tức nổi bật</Link>
            </h2>
            {hotNewsList.map((item: any, index: any) => {
                let newArray = []

                for (var i = 0; i < hotNewsList.length; i++) {
                    newArray.push(hotNewsList[i].views)
                }

                let maxViews = newArray[0]
                for (let i = 0; i < newArray.length; i++) {
                    if (maxViews < newArray[i])
                        maxViews = newArray[i]
                }

                // console.log("newArray", newArray);

                // console.log("maxViews =", maxViews);

                let itemCategory = item.categories[0].name
                if (itemCategory === "POLITICAL") {
                    itemCategory = "CHÍNH TRỊ";
                } else if (itemCategory === "SOCIAL") {
                    itemCategory = "XÃ HỘI";
                } else if (itemCategory === "ECONOMY") {
                    itemCategory = "KINH TẾ";
                } else if (itemCategory === "HEALTH") {
                    itemCategory = "SỨC KHỎE";
                } else if (itemCategory === "EDUCATION") {
                    itemCategory = "GIÁO DỤC";
                } else if (itemCategory === "LAW") {
                    itemCategory = "PHÁP LUẬT";
                } else if (itemCategory === "SPORT") {
                    itemCategory = "THỂ THAO";
                } else if (itemCategory === "WORLD") {
                    itemCategory = "THẾ GIỚI"
                }

                if (item.views === maxViews) {
                    return (
                        <Row key={item.id} className="max-views-news-container">
                            {/* <Col className="max-views-news-img" span={8}> */}
                                <img style={{ width: "300px", height: "auto" }} src={item.img} />
                            {/* </Col> */}
                            <Col className="max-views-news-text" span={16}>
                                <h2 className="max-views-news-title">{item.title}</h2>
                                <div className="max-views-news-category">
                                    <p>{itemCategory}</p>
                                </div>
                                <p>{item.description}</p>
                            </Col>
                        </Row>
                    )
                }
            })}
            <Row className="little-news-container">
                {hotNewsList.map((item: any) => {
                    return (
                        <Row key={item.id} >
                            <Col span={24} className="little-news-items">
                                <div style={{ paddingBottom: 20 }}>
                                    <p className="little-news-title">{item.title}</p>
                                </div>
                                <div>
                                    <p>{item.description}</p>
                                </div>
                            </Col>
                        </Row>
                    )
                })}
            </Row>
        </div>
    );
};

export default HotNews;

// function dispatch(arg0: { payload: any; type: string }) {
//   throw new Error("Function not implemented.");
// }
