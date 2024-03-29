/* eslint-disable react-hooks/exhaustive-deps */
import { UploadOutlined } from '@ant-design/icons'
import { Button, Col, Form, Input, Row, Select, Spin, Upload } from 'antd'
import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { message } from 'antd';
import type { UploadChangeParam } from 'antd/es/upload';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import JoditEditor from "jodit-react";

const getBase64 = (img: RcFile, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result as string));
    reader.readAsDataURL(img);
};

const beforeUpload = (file: RcFile) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
        message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 10;
    if (!isLt2M) {
        message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
};

const EditNews = () => {

    const { params } = useParams()
    const [selectCategories, setSelectCategories] = useState([])
    const [inputChangeTitle, setInputChangeTitle] = useState('')
    const [inputDescription, setInputDescription] = useState('')
    const [changedContent, setChangedContent] = useState('')
    const [categories, setCategories] = useState([])
    const [selectChangeStatus, setSelectChangeStatus] = useState(true)

    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState<string>();

    const handleChange: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {
        if (info.file.status === 'uploading') {
            setLoading(true);
            return;
        }

        if (info.file.status === 'done') {
            // Get this url from response in real world.
            getBase64(info.file.originFileObj as RcFile, url => {
                setLoading(false);
                setImageUrl(url);
            });
        }
    };

    const uploadButton = (
        <div>
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );


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
                console.log(response.data.description);
                console.log(response.data.categorie);
                setImageUrl(response.data.img)


                form.setFieldsValue({
                    category: response.data.categories.map((item: any) => item.id),
                    title: response.data.title,
                    description: response.data.description,
                    content: response.data.content,
                    img: response.data.img
                });
            })
            .catch(error => {
                console.log(error);
            })
    }

    useEffect(() => {
        getNewAPI()
    }, [])

    const categoriesAPI = async () => {
        await axios.get('https://heroku-done-all-manager.herokuapp.com/api/category/user/views')
            .then(response => {
                setCategories(response.data)
            })
            .catch(error => {
                console.log(error)
            })
    }

    useEffect(() => {
        categoriesAPI()
        console.log("categories", categories);
    }, [])

    const normFile = (e: any) => {
        console.log("Upload event:", e);
        console.log(e.file);


        if (Array.isArray(e)) {
            return e;
        }
    };

    const handleSelectTopic = (e: any) => {
        setSelectCategories(e)
        console.log("categories", e);
    }
    console.log("selectCategories", selectCategories);

    const handleInputChangeTitle = (e: any) => {
        setInputChangeTitle(e.target.value);
    }

    const handleInputChangeDescription = (e: any) => {
        setInputDescription(e.target.value);
    }

    const handleInputContent = (e: any) => {
        setChangedContent(e);
    }

    const handleSelectChangeStatus = (e: any) => {
        console.log(e);

        if (e === "pending") {
            setSelectChangeStatus(false)
        }
    }

    const onFinish = (values: any) => {
        console.log("values", values);

        axios.put(`https://heroku-done-all-manager.herokuapp.com/api/news/update/${params}`,
            {
                categories: [{ id: values.category[0] }],
                title: values.title,
                description: values.description,
                content: values.content,
                author: "admin2",
                img: imageUrl,
                status: selectChangeStatus
            }, {
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
        <div>
            <Col span={16} style={{ margin: "0 auto" }}>
                <h2>Sửa bài viết</h2>
                <div
                    style={{
                        backgroundColor: "#fff",
                        padding: "40px 30px",
                        borderRadius: 10,
                    }}
                >
                    <Form
                        name="validate_other"
                        layout="vertical"
                        onFinish={onFinish}
                        form={form}
                    >
                        <Form.Item
                            name="category"
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
                                onChange={handleSelectTopic}
                            >
                                {categories.map((categorie: any) => {
                                    return (
                                        <Select.Option key={categorie.id} value={categorie.id}>
                                            {categorie.name}
                                        </Select.Option>
                                    )
                                })}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="title"
                            label="Tiêu đề"
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
                            label="Mô tả:"
                        // rules={[
                        //     {
                        //         required: true,
                        //         message: "Hãy nhập mô tả của bài viết!",
                        //     },
                        // ]}
                        >
                            <Input
                                placeholder='Nhập mô tả'
                                onChange={handleInputChangeDescription}
                            />
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
                            <JoditEditor
                                ref={editor}
                                value={changedContent}
                                onChange={handleInputContent}
                            />
                        </Form.Item>

                        <Row style={{ justifyContent: "space-around" }}>
                            <Form.Item
                                name="upload"
                                label="Thêm ảnh minh họa:"
                                valuePropName="fileList"
                                getValueFromEvent={normFile}
                            >
                                <Upload
                                    multiple
                                    action={"https://www.mocky.io/v2/5cc8019d300000980a055e76"}
                                    listType="picture"
                                    // onChange={handleUploadPhoto}
                                    showUploadList={{ showRemoveIcon: true }}
                                    accept=".png,.jpeg,.jpg"
                                    beforeUpload={(file: any) => {
                                        console.log(file)
                                        return false
                                    }}
                                    defaultFileList={[
                                        {
                                            uid: "abc",
                                            name: "exising_file.png",
                                            status: "uploading",
                                            percent: 50,
                                            url: "https://www/goolge.com/"
                                        },
                                    ]}
                                    iconRender={() => {
                                        return <Spin></Spin>
                                    }}
                                    // itemRender={(exisingComp: any, file: any) => {
                                    //     return <p>{file.name}</p>
                                    // }}
                                    progress={{
                                        strokeWidth: 3,
                                        strokeColor: {
                                            "0%": "#f0f",
                                            "50%": "#ff0"
                                        }
                                    }}
                                >
                                    <Button>Button</Button>
                                </Upload>
                            </Form.Item>

                            <Form.Item
                                name="status"
                                label="Trạng thái:"
                            >
                                <Select defaultValue="Chờ duyệt" style={{ width: 200 }} onSelect={handleSelectChangeStatus}>
                                    <Select.Option key="pending" value="pending">Chờ duyệt</Select.Option>
                                    <Select.Option key="public" value="public">Công khai</Select.Option>
                                </Select>
                            </Form.Item>
                        </Row>

                        <Form.Item
                            style={{ textAlign: "center" }}
                            wrapperCol={{
                                span: 12,
                                offset: 6,
                            }}
                        >
                            <Button type="primary" htmlType="submit">
                                Lưu thay đổi
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </Col>
        </div>
    )
}

export default EditNews