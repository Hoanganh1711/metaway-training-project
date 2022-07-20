import { Col, Form, Input, Select } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { Button, Upload } from "antd";
import "../../index.css";
import { useEffect, useState } from "react";
import { UploadFile } from "antd/lib/upload/interface";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";
import axios from "axios";
import { url } from "inspector";

const CreateNewsForm = () => {

  const [inputTitle, setInputTitle] = useState('')
  const [inputDescription, setInputDescription] = useState('')
  const [inputContent, setInputContent] = useState('')
  const [uploadPhoto, setUploatPhoto] = useState([])

  const { quill, quillRef } = useQuill();
  useEffect(() => {
    if (quill) {
      quill.on("text-change", (delta: any, oldDelta: any, source: any) => {
        setInputContent(quill.getText())
      });
    }
  }, [quill]);


  const normFile = (e: any) => {
    console.log("Upload event:", e);
    console.log(e.file);


    if (Array.isArray(e)) {
      return e;
    }

    // return e?.fileList;
  };

  const CreateNews = () => {
    axios.post('https://heroku-done-all-manager.herokuapp.com/api/news/create', {
      title: inputTitle,
      description: inputDescription,
      content: inputContent,
      // img: uploadPhoto,
      status: true,
      author: "admin2",
      views: 0
    })
      .then(response => {
        console.log((response));
      })
      .catch(error => {
        console.log(error);
      })

    // const data = {
    //   title: inputTitle,
    //   description: inputDescription,
    //   content: inputContent,
    //   // img: uploadPhoto,
    //   status: true,
    //   author: inputTitle,
    //   views: 0
    // }

    // const url = "https://heroku-done-all-manager.herokuapp.com/api/news/create";
    // fetch(url, {
    //   method: "POST",
    //   body: JSON.stringify(data)
    // })
    // .then(response => {
    //   // response.json();
    //   console.log(response);

    // })
    // .catch(error => {
    //   console.log(error);
    // })
  }

  const handleInputTitle = (e: any) => {
    setInputTitle(e.target.value);
    // console.log(e.target.value);
  };

  const handleInputDescription = (e: any) => {
    setInputDescription(e.target.value);
    // console.log(e.target.value);
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

            <Form.Item
              name="description"
              rules={[
                {
                  required: true,
                  message: "Hãy nhập mô tả của bài viết!",
                },
              ]}>
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
              <Button type="primary" htmlType="submit" onClick={CreateNews}>
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
