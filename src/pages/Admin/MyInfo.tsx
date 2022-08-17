/* eslint-disable react-hooks/exhaustive-deps */
import { CameraFilled, FormOutlined } from "@ant-design/icons"
import { Col, DatePicker, Divider, Form, Input, message, Modal, Row, Tooltip, Upload } from "antd"
import axios from "axios"
import '../../index.css'
import { useEffect, useState } from "react"
import { Image } from 'antd';
import { Select } from 'antd'
import { timeStamp } from "console"
import { useAppSelector, useAppDispatch } from '../../app/hooks'

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

const { Option } = Select;


const AdminInfo = () => {
    const dispatch = useAppDispatch()

    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [userName, setUserName] = useState('')
    const [email, setEmail] = useState('')
    const [address, setAddress] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [rolse, setRolse] = useState([])
    const [avatar, setAvatar] = useState('')
    const [birthDay, setBirthDay] = useState('')
    const [gender, setGender] = useState('')
    const [imageUrl, setImageUrl] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false)

    // Changer User Value State
    // const [changerId, setChangerId] = useState('')
    const [changerFirstName, setChangerFirstName] = useState('')
    const [changerLastName, setChangerLastName] = useState('')
    const [changerEmail, setChangerEmail] = useState('')
    const [changerAddress, setChangerAddress] = useState('')
    const [changerPhoneNumber, setChangerPhoneNumber] = useState('')
    const [changerBirthDay, setChangerBirthDay] = useState('')
    const [changerGender, setChangerGender] = useState('')

    const handleChange = (info: any) => {
        if (info.file.status === 'done') {
            getBase64(info.file.originFileObj, (url: any) => {
                setImageUrl(url);
                editAvatar()
            });
        }
    };

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

    const myInfoApi = async () => {
        await axios.get(`https://heroku-done-all-manager.herokuapp.com/api/v1/user/views/list/${myID}`,
            {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                },
            }
        )
            .then(response => {
                setFirstName(response.data.firstName)
                setLastName(response.data.lastName)
                setUserName(response.data.username)
                setEmail(response.data.email)
                setAddress(response.data.address)
                setPhoneNumber(response.data.phoneNumber)
                setRolse(response.data.roles)
                setAvatar(response.data.avt)
                setBirthDay(response.data.birthday)
                setGender(response.data.gender)

                form.setFieldsValue({
                    lastName: response.data.lastName,
                    firstName: response.data.firstName,
                    //birthday: response.data.birthday,
                    gender: response.data.gender,
                    email: response.data.email,
                    address: response.data.address,
                    phoneNumber: response.data.phoneNumber
                });
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

    const handleChangerFirstName = (e: any) => {
        setChangerFirstName(e.target.value)
    }
    const handleChangerLastName = (e: any) => {
        setChangerLastName(e.target.value)
    }
    const handleChangerEmail = (e: any) => {
        setChangerEmail(e.target.value)
    }
    const handleChangerAddress = (e: any) => {
        setChangerAddress(e.target.value)
    }
    const handleChangerPhoneNumber = (e: any) => {
        setChangerPhoneNumber(e.target.value)
    }
    const handleChangerGender = (e: any) => {
        setChangerGender(e)
    }

    const handleChangerBirthday = (e: any) => {
        console.log("birthDay", e);

        // const timestampDate = Date.parse(e._d) / 1000;
        // var a = new Date(timestampDate * 1000)
        // let date = a.getDate().toString();
        // date.toString().length === 1 ? date = "0" + a.getDate() : a.getDate()

        // let month = (a.getMonth() + 1).toString()
        // month.toString().length === 1 ? month = "0" + a.getMonth() : a.getMonth()
        // const year = a.getFullYear()
        // const selectedDate = year + '-' + month + '-' + date

        // console.log("selectedDate", selectedDate);

        // setChangerBirthDay(selectedDate)
    }


    const [form] = Form.useForm();

    // form.setFieldsValue({
    //     lastName: changerFirstName,
    //     firstName: 'male',
    //     birthday: "",
    //     gender: "",
    //     email: "",
    //     address: "",
    //     phoneNumber: ""
    //   });

    const handleEditInfo = () => {
        form.validateFields()
            .then((values: any) => {
                let birthday = values.birthday._d
                const timestampBirthday = Date.parse(birthday) / 1000
                var a = new Date(timestampBirthday * 1000)
                let date = a.getDate() < 10 ? "0" + a.getDate() : a.getDate()
                let month = a.getMonth() < 10 ? "0" + a.getMonth() : a.getMonth()
                let year = a.getFullYear()

                const newBirthDay = year + "/" + month + "/" + date

                values.birthday = newBirthDay
                console.log("values", values);

                // form.setFieldsValue({
                //     lastName: values.lastName,
                //     firstName: values.firstName,
                //     birthday: values.birthday,
                //     gender: values.gender,
                //     email: values.email,
                //     address: values.address,
                //     phoneNumber: values.phoneNumber
                // });

                axios.put(`https://heroku-done-all-manager.herokuapp.com/api/v1/user/update/${myID}`,
                    {
                        lastName: changerLastName,
                        firstName: changerFirstName,
                        birthday: changerBirthDay,
                        gender: changerGender,
                        email: changerEmail,
                        address: changerAddress,
                        phoneNumber: changerPhoneNumber
                        // values
                    }
                    ,
                    {
                        headers: {
                            Authorization: "Bearer " + localStorage.getItem("token"),
                        },
                    }
                )
                    .then(response => {
                        console.log(response);
                    })
                    .catch(error => {
                        console.log(error);
                    })
            })
        // handleOk()
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

            <Modal title="Cập nhật thông tin cá nhân" visible={isModalVisible} okText="Submit" onOk={handleEditInfo} onCancel={handleCancel} forceRender>
                <Form
                    layout="vertical"
                    scrollToFirstError
                    form={form}
                >
                    <div>
                        <Row style={{ justifyContent: "space-between" }}>
                            <Col span={11}>
                                <Form.Item
                                    name="firstName"
                                    label="First Name"
                                >
                                    <Input placeholder='First Name' onChange={handleChangerFirstName} />
                                </Form.Item>
                            </Col>

                            <Col span={11}>
                                <Form.Item
                                    name="lastName"
                                    label="Last Name"
                                >
                                    <Input placeholder='Last Name' onChange={handleChangerLastName} />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row style={{ justifyContent: "space-between" }}>
                            <Col span={11}>
                                <Form.Item
                                    name="birthday"
                                    label="Birthday"
                                >
                                    <DatePicker onChange={handleChangerBirthday} />
                                </Form.Item>
                            </Col>

                            <Col span={11}>
                                <Form.Item
                                    name="gender"
                                    label="Gender"
                                >
                                    <Select style={{ width: 120 }} onChange={handleChangerGender}>
                                        <Option value="Nam">Nam</Option>
                                        <Option value="Nữ">Nữ</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item
                            name="phoneNumber"
                            label="Phone Number"
                        >
                            <Input placeholder='Phone Number' onChange={handleChangerPhoneNumber} />
                        </Form.Item>

                        <Form.Item
                            name="email"
                            label="Email"
                            rules={[{ type: 'email' }]}
                        >
                            <Input placeholder='Email' onChange={handleChangerEmail} />
                        </Form.Item>

                        <Form.Item
                            name="address"
                            label="Address"
                        >
                            <Input placeholder='Address' onChange={handleChangerAddress} />
                        </Form.Item>
                    </div>
                </Form>
            </Modal>
        </div>
    )
}

export default AdminInfo