// import {
//   CommentOutlined,
//   LikeFilled,
//   LikeOutlined,
//   SaveFilled,
//   SaveOutlined,
//   TableOutlined,
//   UserOutlined,
// } from "@ant-design/icons";
import { notification } from "antd";
import { Col, Row } from "antd";
import React, { useRef, useState } from "react";
import "../../index.css";
import {
  selectAuthor,
  selectContent,
  selectPhoto,
  selectTitle,
} from "../../features/counter/counterSlice";
import { useAppSelector } from "../../app/hooks";

const ShowNews = () => {
  const title = useAppSelector(selectTitle);
  const content = useAppSelector(selectContent);
  const author = useAppSelector(selectAuthor);
  const photo = useAppSelector(selectPhoto);

  const [like, setLike] = useState(true);
  const [likeQuantity, setLikeQuantity] = useState(0);
  const [save, setSave] = useState(true);

  const Like = like;
  const Save = save;

  //Hàm xử lý nút like
  const handleLike = () => {
    if (like) {
      setLike(false);
      setLikeQuantity(likeQuantity + 1);
    } else {
      setLike(true);
      setLikeQuantity(likeQuantity - 1);
    }
  };

  // Xử lý focus comment Input
  const commentInput = useRef<any>(null);

  const handleFocus = () => {
    commentInput.current?.focus();
  };

  // Xử lý lưu tin tức

  const Context = React.createContext({
    name: "Default",
  });

  const [api, contextHolder] = notification.useNotification();

  const handleSave = () => {
    if (save) {
      setSave(false);
      api.info({
        message: ``,
        description: (
          <Context.Consumer>
            {({ name }) => `Đã lưu bài viết!`}
          </Context.Consumer>
        ),
      });
    } else {
      setSave(true);
    }
  };

  return (
    <Context.Provider
      value={{
        name: "Ant Design",
      }}
    >
      {contextHolder}
      <Col span={15} style={{ margin: "0 auto" }}>
        <Row>
          <Col span={15} style={{ margin: "auto" }}>
            <div
              className="new-contener"
              style={{ backgroundColor: "#fff", marginTop: 20 }}
            >
              <div style={{ padding: 20 }}>
                <h1 className="new-title">{title}</h1>
                <Row>{photo}</Row>
                <div>{content}</div>
                <br></br>
                <Row style={{ justifyContent: "flex-end" }}>
                  <p>
                    Tác giả: <b>{author}</b>
                  </p>
                </Row>
              </div>

              {/* <div className='feedback-items'>
                                    <Row style={{ justifyContent: "space-around", fontSize: 20, marginTop: 10, padding: "10px 0", borderTop: "solid 1px #ccc", borderBottom: "solid 1px #ccc" }}>
                                        <div style={{ cursor: "pointer" }} onClick={handleLike}>{Like ? <LikeOutlined /> : <LikeFilled />}(<span>{likeQuantity}</span>)</div>
                                        <div style={{ cursor: "pointer" }} onClick={handleFocus}><CommentOutlined /></div>
                                        <div style={{ cursor: "pointer" }} onClick={() => handleSave()}>{Save ? <SaveOutlined /> : <SaveFilled />}</div>
                                    </Row>
                                    <Row className='comment' style={{ padding: 20, display: "hiden" }}>
                                        <UserOutlined style={{ fontSize: 30 }} />
                                        <input
                                            style={{ backgroundColor: "#f9fafb", width: "90%", marginLeft: 5, borderRadius: 50, padding: "4px 10px", border: "1px solid #d2d2d2", outline: "none" }}
                                            ref={commentInput}
                                            id="comment"
                                            name="comment"
                                        />
                                    </Row>
                                </div> */}
            </div>
          </Col>
        </Row>
      </Col>
    </Context.Provider>
  );
};

export default ShowNews;
