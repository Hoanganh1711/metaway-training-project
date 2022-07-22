/* eslint-disable react-hooks/exhaustive-deps */
import { UploadOutlined } from '@ant-design/icons'
import { Button, Col, Form, Input, Upload } from 'antd'
import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import JoditEditor from "jodit-react";

const EditNews = () => {

    const { params } = useParams()
    const [inputTitle, setInputTitle] = useState('')
    const [inputDescription, setInputDescription] = useState('')
    const [content, setContent] = useState('')
    // const [uploadPhoto, setUploatPhoto] = useState([])

    const [form] = Form.useForm();

    const editor = useRef(null)

    console.log('params', params);

    const getNewAPI = async () => {
        await axios.get(`https://heroku-done-all-manager.herokuapp.com/api/news/manager/views/${params}`,
            {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem("token")
                }
            }
        )
            .then(response => {
                console.log(response.data.title);
                form.setFieldsValue({
                    title: response.data.title,
                    description: response.data.description,
                    content: response.data.content
                });
            })
            .catch(error => {
                console.log(error);
            })
    }

    useEffect(() => {
        getNewAPI()
    }, [])

    const normFile = (e: any) => {
        console.log("Upload event:", e);
        console.log(e.file);


        if (Array.isArray(e)) {
            return e;
        }
    };


    const handleInputChangeTitle = (e: any) => {
        setInputTitle(e.target.value);
    }

    const handleInputChangeDescription = (e: any) => {
        setInputDescription(e.target.value);
    }

    const handleInputContent = (e: any) => {
        setContent(e);
    }

    const saveChange = () => {
        axios.put(`https://heroku-done-all-manager.herokuapp.com/api/news/update/${params}`,
            {
                title: inputTitle,
                description: inputDescription,
                content: content,
            },
            {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem("token")
                }
            }
        )
        .then(response => {
            console.log(response);
        })
        .catch(error => {
            console.log(error);
            
        })
    }


    return (
        <>
            <Col span={12} style={{ margin: "0 auto" }}>
                <h2>Sửa bài viết</h2>
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
                            form={form}
                        >
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
                                    placeholder="Nhập tiêu đề bài viết"
                                    onChange={handleInputChangeTitle}
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
                                <Input
                                    placeholder='Nhập mô tả'
                                    onChange={handleInputChangeDescription}
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
                                <JoditEditor
                                    ref={editor}
                                    value={content}
                                    onChange={handleInputContent}
                                />
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
                                <Button type="primary" htmlType="submit" onClick={saveChange}>
                                    Lưu thay đổi
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            </Col>
        </>
    )
}

export default EditNews