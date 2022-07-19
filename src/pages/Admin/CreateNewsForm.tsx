import { Col, Form, Input, Select } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { Button, Upload } from "antd";
import "../../index.css";
import { useEffect, useState } from "react";
import { UploadFile } from "antd/lib/upload/interface";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";

const CreateNewsForm = () => {
  const { Option } = Select;

  const { quill, quillRef } = useQuill();

  const normFile = (e: any) => {
    console.log("Upload event:", e);

    if (Array.isArray(e)) {
      return e;
    }

    return e?.fileList;
  };

  const fileList: UploadFile[] = [
    // {
    //     uid: '-1',
    //     name: 'xxx.png',
    //     status: 'done',
    //     url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    //     thumbUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    // },
  ];

  // const [inputedValue, setInputedValue] = useState([])

  const newsAPI = "https://heroku-manager-news.herokuapp.com/api/test/user";

  const onFinish = (value: any) => {
    console.log("Success:", value);
    const topic = "";
    const title = value.title;
    const content = value.content;
    const photo = value.upload;

    const option = {
      method: "POST",
      body: JSON.stringify(value),
    };

    fetch(newsAPI, option).then((response) => {
      response.json();
    });
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
          <Form name="validate_other" onFinish={onFinish}>
            <Form.Item
              name="topic"
              hasFeedback
              rules={[
                {
                  required: true,
                  message: "Hãy chọn chủ đề của bài viết!",
                },
              ]}
            >
              <Select placeholder="Chọn chủ đề *">
                <Option value="Chủ đề 1">Chủ đề 1</Option>
                <Option value="Chủ đề 2">Chủ đề 2</Option>
                <Option value="Chủ đề 3">Chủ đề 3</Option>
              </Select>
            </Form.Item>

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
              />
            </Form.Item>

            <Form.Item
              name="description"
            >
              <Input
                placeholder="Mô tả"
              />
            </Form.Item>

            <Form.Item
              name="content"
              rules={[
                {
                  required: true,
                  message: "Hãy nhập nội dung của bài viết!",
                },
              ]}
            >
              <div >
                <div ref={quillRef} />
              </div>
            </Form.Item>

            <Form.Item
              name="upload"
              valuePropName="fileList"
              getValueFromEvent={normFile}
            >
              <Upload
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                listType="picture"
                // defaultFileList={[...fileList]}
                className="upload-list-inline"
              // onChange={handleUploadPhoto}
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
              <Button type="primary" htmlType="submit">
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
