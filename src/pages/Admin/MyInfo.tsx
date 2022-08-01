import { AntDesignOutlined } from "@ant-design/icons"
import { Avatar, Col, Divider, Row } from "antd"
import axios from "axios"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"


const AdminInfo = () => {
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [userName, setUserName] = useState('')
    const [email, setEmail] = useState('')
    const [address, setAddress] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [rolse, setRolse] = useState([])

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
                setUserName(response.data.username)
                setEmail(response.data.email)
                setAddress(response.data.address)
                setPhoneNumber(response.data.phoneNumber)
                setRolse(response.data.roles)
            })
            .catch(error => {
                console.log(error);
            })
    }

    useEffect(() => {
        myInfoApi()
    }, [])


    return (
        <div className="Info-container">
            <Row className="Info-header">
                <Avatar
                    className="avatar"
                    size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
                    icon={<AntDesignOutlined />}
                />
                <div className="heading-info">
                    <h2>{firstName} {lastName}</h2>
                    <p>Chức vụ: {rolse.map((item: any) => {
                        if (item.name === "ROLE_ADMIN") {
                            item.name = "Admin"
                        }
                        return (
                            <span><b>{item.name}</b></span>
                        )
                    })}</p>
                </div>
                <Divider />
            </Row>
            <div>
                <p><b>Thông tin liên hệ:</b></p>
                <div>
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
                </div>

            </div>
        </div>
    )
}

export default AdminInfo