import { CameraFilled, FormOutlined } from "@ant-design/icons"
import { Col, Divider, Form, Input, message, Modal, Row, Tooltip, Upload } from "antd"
import axios from "axios"
import '../../index.css'
import { useEffect, useState } from "react"
import { Image } from 'antd';

const editProfileText = <span>Edit profile</span>
const editAvatarText = <span>Update Avatar</span>

const getBase64 = (img: any, callback: any) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
};

const beforeUpload = (file: any) => {
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



const AdminInfo = () => {
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [address, setAddress] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [rolse, setRolse] = useState([])
    const [avatar, setAvatar] = useState('')
    const [birthDay, setBirthDay] = useState('')
    const [gender, setGender] = useState('')
    const [imageUrl, setImageUrl] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleChange = (info: any) => {
        if (info.file.status === 'done') {
            getBase64(info.file.originFileObj, (url: any) => {
                setImageUrl(url);
                editAvatar()
            });
        }
    };

    console.log('imageUrl', imageUrl);

    const editAvatar = () => {
        axios.put(`https://heroku-done-all-manager.herokuapp.com/api/v1/user/update/${myID}`,
            {
                avt: imageUrl
            },
            {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                }
            }
        )
    }


    const myID = localStorage.getItem('id')
    console.log(myID);

    const myInfoApi = () => {
        axios.get(`https://heroku-done-all-manager.herokuapp.com/api/v1/user/views/list/${myID}`,
            {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                },
            }
        )
            .then(response => {
                console.log(response.data);
                setFirstName(response.data.firstName)
                setLastName(response.data.lastName)
                setEmail(response.data.email)
                setAddress(response.data.address)
                setPhoneNumber(response.data.phoneNumber)
                setRolse(response.data.roles)
                setAvatar(response.data.avt)
                setBirthDay(response.data.birthday)
                setGender(response.data.gender)
            })
            .catch(error => {
                console.log(error);
            })
    }

    useEffect(() => {
        myInfoApi()
    }, [])

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const openEditInfoForm = () => {
        setIsModalVisible(true);
    }

    return (
        <div className="Info-container">
            <Row className="Info-header">
                <div className="avatar-container" >
                    <Upload
                        name="avatar"
                        className="avatar-uploader"
                        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                        showUploadList={false}
                        beforeUpload={beforeUpload}
                        onChange={handleChange}
                    >
                        <Tooltip placement="right" title={editAvatarText}>
                            <div className="camera-icon"><CameraFilled /></div>
                        </Tooltip>
                    </Upload>
                    <div className="avatar" style={{ borderRadius: '50%' }}>
                        {(typeof avatar === "object") ?
                            <Image
                                style={{ borderRadius: "50%" }}
                                width="100%"
                                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmywnX8X85jiWUi9y_1ul_75WhF82V5yq41A&usqp=CAU"
                            />
                            :
                            <Image
                                style={{ borderRadius: "50%" }}
                                width="100%"
                                src={avatar}
                            />
                        }
                    </div>
                </div>
                <div className="heading-info">
                    <h2>{firstName} {lastName}</h2>
                    <p>Chức vụ: {rolse.map((item: any) => {
                        if (item.name === "ROLE_ADMIN") {
                            item.name = "Admin"
                        }
                        return (
                            <span key={item.name}><b>{item.name}</b></span>
                        )
                    })}</p>
                </div>
                <Divider />
            </Row>
            <div className="body-info">
                <div onClick={openEditInfoForm}>
                    <Tooltip className="edit-icon" placement="bottom" title={editProfileText}>
                        <FormOutlined />
                    </Tooltip>
                </div>

                <p><b>Thông tin liên hệ:</b></p>
                <div >
                    <Row className="info-item">
                        <Col span={8}>
                            Email:
                        </Col>
                        <Col span={8}>
                            <span>{email}</span>
                        </Col>
                    </Row>
                    <Row className="info-item">
                        <Col span={8}>
                            Số điện thoại:
                        </Col>
                        <Col span={8}>
                            <span>{phoneNumber}</span>
                        </Col>
                    </Row>
                    <Row className="info-item">
                        <Col span={8}>
                            Địa chỉ:
                        </Col>
                        <Col span={8}>
                            <span>{address}</span>
                        </Col>
                    </Row>
                    <Row className="info-item">
                        <Col span={8}>
                            Sinh nhật:
                        </Col>
                        <Col span={8}>
                            {birthDay ? <span>{birthDay}</span> : <span>---</span>}

                        </Col>
                    </Row>
                    <Row className="info-item">
                        <Col span={8}>
                            Giới tính:
                        </Col>
                        <Col span={8}>
                            {gender ? <span>{gender}</span> : <span>---</span>}
                        </Col>
                    </Row>
                </div>
            </div>

            <Modal title="Cập nhật thông tin cá nhân" visible={isModalVisible} okText="Submit" onOk={handleOk} onCancel={handleCancel}>
                <Form
                    layout="vertical"
                    scrollToFirstError
                >
                    <div>
                        <Row style={{ justifyContent: "space-between" }}>
                            <Col span={11}>
                                <Form.Item
                                    name="First Name"
                                    label="First Name"
                                >
                                    <Input placeholder='First Name' />
                                </Form.Item>
                            </Col>

                            <Col span={11}>
                                <Form.Item
                                    name="Last Name"
                                    label="Last Name"
                                >
                                    <Input placeholder='Last Name' />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item
                            name="phonenumber"
                            label="Phone Number"
                        >
                            <Input placeholder='Phone Number' />
                        </Form.Item>

                        <Form.Item
                            name="email"
                            label="Email"
                            rules={[{ type: 'email' }]}
                        >
                            <Input placeholder='Email' />
                        </Form.Item>

                        <Form.Item
                            name="address"
                            label="Address"
                        >
                            <Input placeholder='Address' />
                        </Form.Item>
                    </div>
                </Form>
            </Modal>
        </div>
    )
}

export default AdminInfo