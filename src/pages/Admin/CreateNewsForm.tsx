import { Col, Form, Input, Select } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { Button, Upload } from "antd";
import "../../index.css";
import { useEffect, useState } from "react";
import { UploadFile } from "antd/lib/upload/interface";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";
import axios from "axios";

const CreateNewsForm = () => {

  const [inputTitle, setInputTitle] = useState('')
  const [inputDescription, setInputDescription] = useState('')
  const { quill, quillRef } = useQuill();
  const [uploadPhoto, setUploatPhoto] = useState([])

  useEffect(() => {
    if (quill) {
      quill.on("text-change", (delta: any, oldDelta: any, source: any) => {
        // console.log("Text change!");
        // console.log(quill.getText()); // Get text only
        // console.log(quill.getContents()); // Get delta contents
        // console.log(quill.root.innerHTML); // Get innerHTML using quill
        // console.log(quillRef.current.firstChild.innerHTML); // Get innerHTML using quillRef
      });
    }
  }, [quill]);
  

  const normFile = (e: any) => {
    console.log("Upload event:", e);

    if (Array.isArray(e)) {
      return e;
    }

    return e?.fileList;
  };

  const PostNews = () => {
    axios.post('https://heroku-manager-news.herokuapp.com/api/test/admin', {
      title: inputTitle,
      description: inputDescription,
      content: quill.getText(),
      img: uploadPhoto,
    })
    .then(response => {
      console.log((response));
    })
    .catch(error => {
      console.log(error);
    })
  }

  const handleInputTitle = (e: any) => {
    setInputTitle(e.target.value);
  };

  const handleInputDescription = (e: any) => {
    setInputDescription(e.target.value);
  };

  const handleUploadPhoto = (e: any) => {
    setUploatPhoto(e);
  };

  return (
    <Col span={15} style={{ margin: "0 auto 0 auto" }}>
      <h2>Tạo bài viết</h2>
      <div
        style={{
          backgroundColor: "#fff",
          padding: "40px 30px",
          borderRadius: 10,
        }}
      >
        <div>
          <Form name="validate_other">
            <Form.Item
              name="title"
              rules={[
                {
                  required: true,
                  message: "Hãy nhập tiêu đề của bài viết!",
                },
              ]}
            >
              <Input
                showCount
                maxLength={20}
                placeholder="Nhập tiêu đề bài viết *"
                onChange={handleInputTitle}
              />
            </Form.Item>

            <Form.Item name="description">
              <Input placeholder="Mô tả" onChange={handleInputDescription} />
            </Form.Item>

            <Form.Item
              name="content"
              // rules={[
              //   {
              //     required: true,
              //     message: "Hãy nhập nội dung của bài viết!",
              //   },
              // ]}
            >
              <div ref={quillRef} />
            </Form.Item>

            <Form.Item
              name="upload"
              valuePropName="fileList"
              getValueFromEvent={normFile}
            >
              <Upload
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                listType="picture"
                className="upload-list-inline"
                onChange={handleUploadPhoto}
              >
                <Button icon={<UploadOutlined />}>Thêm ảnh</Button>
              </Upload>
            </Form.Item>

            <Form.Item
              wrapperCol={{
                span: 12,
                offset: 6,
              }}
            >
              <Button type="primary" htmlType="submit" onClick={PostNews}>
                Đăng tin
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </Col>
  );
};

export default CreateNewsForm;
