/* eslint-disable jsx-a11y/alt-text */
import { Row, Typography } from 'antd'
import form from 'antd/lib/form'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Image } from 'antd';
const { Title } = Typography;

const CheckViewNews = () => {

    const { params } = useParams()
    const [categories, setCategories] = useState([])
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [content, setContent] = useState('')
    const [author, setAuthor] = useState('')
    const [img, setImg] = useState('')
    const [createdAt, setCreatedAt] = useState('')

    const getNewAPI = async () => {
        await axios.get(`https://heroku-done-all-manager.herokuapp.com/api/news/manager/views/${params}`,
            {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem("token")
                }
            }
        )
            .then(response => {
                setCategories(response.data.categories)
                setTitle(response.data.title)
                setDescription(response.data.description)
                setContent(response.data.content)
                setAuthor(response.data.author)
                setImg(response.data.img)
                setCreatedAt(response.data.createdAt)
            })
            .catch(error => {
                console.log(error);
            })
    }

    useEffect(() => {
        getNewAPI()
    }, [])

    return (
        <div className='news-container'>
            <Row style={{ justifyContent: "space-between" }}>
                {categories.map((category: any, index: any) => {
                    if (category.name === "HOMEPAGE") {
                        category.name = "Trang chủ";
                    } else if (category.name === "POLITICAL") {
                        category.name = "Chính trị";
                    } else if (category.name === "SOCIAL") {
                        category.name = "Xã hội";
                    } else if (category.name === "ECONOMY") {
                        category.name = "Kinh tế";
                    } else if (category.name === "HEALTH") {
                        category.name = "Sức khỏe";
                    } else if (category.name === "EDUCATION") {
                        category.name = "Giáo dục";
                    } else if (category.name === "LAW") {
                        category.name = "Pháp luật";
                    } else if (category.name === "SPORT") {
                        category.name = "Thể thao";
                    } else if (category.name === "WORLD") {
                        category.name = "Thế giới";
                    }
                    return (
                        <Link key={index} to="#">{category.name}</Link>
                    )
                })}
                <p>{createdAt}</p>
            </Row>
            <div className='title'>
                <Title level={2}>{title}</Title>
            </div>
            <div className='description'>
                {description}
            </div>
            <div style={{ padding: "10px 0" }}>
                {img ? <Image style={{ padding: "20px 0" }} width={"100%"} height={400} src={img}>Ảnh</Image> : null}
            </div>

            <div className='content'>
                {content}
            </div>
            <div className='author'><b>{author}</b></div>
        </div>
    )
}

export default CheckViewNews