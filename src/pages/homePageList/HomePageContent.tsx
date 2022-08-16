import HotNews from "./HotNews";
import NewCreateNews from "./NewCreateNews";
import Footer from "../../Footer";
import ShowNews from "./ShowNews";
import { BackTop } from "antd";
import { ArrowUpOutlined } from "@ant-design/icons";
import { useEffect, useLayoutEffect, useState } from "react";


const style: React.CSSProperties = {
    height: 40,
    width: 40,
    lineHeight: "40px",
    borderRadius: 4,
    backgroundColor: "#1088e9",
    color: "#fff",
    textAlign: "center",
    fontSize: 14,
};

const HomePageContent = () => {

    return (
        <div>
            <HotNews />
            <NewCreateNews />
            <Footer />

            <BackTop>
                <div style={style}>
                    <ArrowUpOutlined />
                </div>
            </BackTop>
        </div>
    );
};

export default HomePageContent;