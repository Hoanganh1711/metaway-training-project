import { Col, Form, Input, Select, Spin } from "antd";
import { UploadOutlined, LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Upload, message } from "antd";
import "../../index.css";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
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
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
};

const CreateNewsForm = () => {
    const editor = useRef(null)

    const [selectCategories, setSelectCategories] = useState([])
    const [inputTitle, setInputTitle] = useState('')
    const [inputDescription, setInputDescription] = useState('')
    const [inputContent, setInputContent] = useState('')
    const [categories, setCategories] = useState([])

    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState<string>();

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
            img: imageUrl,
            status: true,
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

    const handleInputContent = (e: any) => {
        setInputContent(e)
    }

    const handleUploadPhoto: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {
        
        if (info.file.status === 'uploading') {
            setLoading(true);
            return;
        }

        if (info.file.status === 'done') {
            getBase64(info.file.originFileObj as RcFile, url => {
                setLoading(true);
                setImageUrl(url);
            });
        }
    };
    console.log("imgUrl", imageUrl);


    const uploadButton = (
        <div>
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );


    return (
        <Col span={15} style={{ margin: "0 auto 0 auto" }}>
            <h2>Đăng bài viết</h2>
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
                                        <Select.Option key={categorie.name} value={categorie.name.toLowerCase()}>
                                            {categorie.name}
                                        </Select.Option>
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
                            <JoditEditor
                                ref={editor}
                                onChange={handleInputContent}
                                value={inputContent}
                            />
                        </Form.Item>

                        <Form.Item
                            name="upload"
                            label="Thêm ảnh minh họa:"
                            valuePropName="fileList"
                            getValueFromEvent={normFile}
                        >
                            <Upload
                                multiple
                                action={"https://heroku-done-all-manager.herokuapp.com/api/v1/image/upload"}
                                listType="picture"
                                onChange={handleUploadPhoto}
                                showUploadList={{ showRemoveIcon: true }}
                                accept=".png,.jpeg,.jpg"
                                // beforeUpload={(file) => {
                                //     console.log(file)
                                //     return true
                                // }}
                                beforeUpload={beforeUpload}
                                // defaultFileList={[
                                //     {
                                //         uid: "abc",
                                //         name: "exising_file.png",
                                //         status: "uploading",
                                //         percent: 50,
                                //         url: "https://www/goolge.com/"
                                //     },
                                // ]}
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
