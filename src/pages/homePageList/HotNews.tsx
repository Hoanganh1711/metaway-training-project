import { EyeOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { MessageOutlined } from "@ant-design/icons";
import { List, Space } from "antd";
import "../../index.css"
import { Link } from "react-router-dom";
import {
  setTitle,
  setContent,
  setAuthor,
  setPhoto,
} from "../../features/counter/counterSlice";
import { useDispatch } from "react-redux";
import { useAppDispatch } from "../../app/hooks";

const HotNews = () => {
  const [hotNewsList, setHotNewsList] = useState<any[]>([]);

  const hotNewsListAPI = async () => {
    const url = "https://heroku-manager-news.herokuapp.com/api/test/all";
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
    <div style={{ margin: "50px auto", width: 900 }}>
      <p style={{ fontSize: 24, fontWeight: 500 }}>Tin tức nổi bật</p>
      <>
        <List
          className="hot-news-list"
          style={{ backgroundColor: "#fff", padding: 15 }}
          itemLayout="vertical"
          size="large"
          pagination={{
            onChange: (page) => {
              console.log(page);
            },
            pageSize: 3,
          }}
          dataSource={hotNewsList}
          renderItem={(item, index) => (
            <List.Item
              key={item.id}
              actions={[
                <IconText
                  icon={EyeOutlined}
                  text={hotNewsList[index].views}
                  key="list-vertical-star-o"
                />,
                <IconText
                  icon={MessageOutlined}
                  text="2"
                  key="list-vertical-message"
                />,
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
                title={
                  <Link
                    onClick={() => handleClickGetShowNews(hotNewsList, index)}
                    to="/showNews"
                  >
                    {item.title}
                  </Link>
                }
                description={item.description}
              />
              {/* {item.content} */}
            </List.Item>
          )}
        />
      </>
    </div>
  );
};

export default HotNews;

// function dispatch(arg0: { payload: any; type: string }) {
//   throw new Error("Function not implemented.");
// }
