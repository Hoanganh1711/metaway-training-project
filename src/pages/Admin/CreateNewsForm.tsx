import { Col, Form, Input, Select } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { Button, Upload } from "antd";
import "../../index.css";
import { useEffect, useState } from "react";
// import { UploadFile } from "antd/lib/upload/interface";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";
import axios from "axios";

const CreateNewsForm = () => {

    const [selectCategories, setSelectCategories] = useState([])
    const [inputTitle, setInputTitle] = useState('')
    const [inputDescription, setInputDescription] = useState('')
    const [inputContent, setInputContent] = useState('')
    const [uploadPhoto, setUploatPhoto] = useState([])
    const [categories, setCategories] = useState([])

    const categoriesAPI = async () => {
        await axios.get('https://heroku-done-all-manager.herokuapp.com/api/category/user/views')
            .then(response => {
                setCategories(response.data)
                console.log(response.data);
            })
            .catch(error => {
                console.log(error)
            })
    }

    useEffect(() => {
        categoriesAPI()
    }, [])

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
            category: selectCategories,
            title: inputTitle,
            description: inputDescription,
            content: inputContent,
            // img: uploadPhoto,
            status: false,
            author: "admin2",
            views: 0
        }, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem("token")
            }
        })
            .then(response => {
                console.log((response));
            })
            .catch(error => {
                console.log(error);
            })
    }

    const handleSelectCategories = (e: any) => {
        setSelectCategories(e)
    }

    useEffect(() => {
        console.log("selectCategories", selectCategories);
        
    }, [selectCategories])

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
                    <Form
                        name="validate_other"
                        layout="vertical"
                    >
                        <Form.Item
                            name="topic"
                            label="Chủ đề:"
                            rules={[
                                {
                                    required: true,
                                    message: 'Chưa lựa chọn chủ đề',
                                    type: 'array',
                                },
                            ]}
                        >
                            <Select
                                mode="multiple"
                                placeholder="Lựa chọn chủ đề của bài viết"
                                onChange={handleSelectCategories}
                            >
                                {categories.map((categorie: any) => {
                                    return (
                                        <>
                                            <Select.Option key={categorie.index} value={categorie.name.toLowerCase()}>
                                                {categorie.name}
                                            </Select.Option>
                                        </>
                                    )
                                })}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="title"
                            label="Tiêu đề:"
                            rules={[
                                {
                                    required: true,
                                    message: "Hãy nhập tiêu đề của bài viết!",
                                },
                            ]}
                        >
                            <Input
                                placeholder="Nhập tiêu đề bài viết *"
                                onChange={handleInputTitle}
                            />
                        </Form.Item>

                        <Form.Item
                            name="description"
                            label="Mô tả:"
                        // rules={[{ required: true, message: 'Hãy nhập mô tả của bài viết!' }]}
                        >
                            <Input.TextArea onChange={handleInputDescription} maxLength={1000} />
                        </Form.Item>

                        <Form.Item
                            name="content"
                            label="Nội dung bài viết:"
                            rules={[
                                {
                                    required: true,
                                    message: "Hãy nhập nội dung của bài viết!",
                                },
                            ]}
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
                            style={{ textAlign: "center" }}
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
