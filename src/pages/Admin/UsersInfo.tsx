import { AntDesignOutlined } from "@ant-design/icons"
import { Avatar, Col, Divider, Row } from "antd"


const AdminInfo = () => {
  return (
    <div className="Info-container">
      <Row className="Info-header">
        <Avatar
          className="avatar"
          size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
          icon={<AntDesignOutlined />}
        />
        <div className="heading-info">
          <h3>User Full Name</h3>
          <p>Chức vụ</p>
        </div>
        <Divider />
      </Row>
      <div>
        <p><b>Thông tin liên hệ</b></p>
        <div>
          <Row className="info-item">
            <Col span={8}>
              Email:
            </Col>
            <Col span={8}>
              <span>hoanggiaanh171193@gmail.com</span>
            </Col>
          </Row>
          <Row className="info-item">
            <Col span={8}>
              Số điện thoại:
            </Col>
            <Col span={8}>
              <span>0367093593</span>
            </Col>
          </Row>
        </div>

      </div>
    </div>
  )
}

export default AdminInfo