import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import App from "./App";
import SignIn from "./pages/homePageList/SignInForm";
import SignUp from "./pages/homePageList/SignUpForm";
import HomePageContent from "./pages/homePageList/HomePageContent";
import ShowNews from "./pages/homePageList/ShowNews";
import Manager from "./pages/Admin/Manager";
import UsersInfo from "./pages/Admin/MyInfo";
import CreateNewsForm from "./pages/Admin/CreateNewsForm";
import NewsManager from "./pages/Admin/NewsManager";
import { store } from "./app/store";
import { Provider } from "react-redux";
import EditNews from "./pages/Admin/EditNews";
import CheckViewNews from "./pages/Admin/CheckViewNews";
import UsersManager from "./pages/Admin/UsersManager";

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
);
root.render(
    <Provider store={store}>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />}>
                    <Route path="/" element={<HomePageContent />} />
                    <Route path="/signIn" element={<SignIn />} />
                    <Route path="/signUp" element={<SignUp />} />
                    <Route path="/showNews" element={<ShowNews />} />
                </Route>
                <Route path="/Manager" element={localStorage.getItem("roles") === "ROLE_ADMIN" ? <Manager /> : <Navigate to="/" />}>
                    <Route path="/Manager/MyInfo" element={<UsersInfo />} />
                    <Route path="/Manager/CreateNewsForm" element={<CreateNewsForm />} />
                    <Route path="/Manager/NewsManager" element={<NewsManager />} />
                    <Route path="/Manager/UsersManager" element={<UsersManager />} />
                    <Route path="/Manager/EditNews/:params" element={<EditNews />} />
                    <Route path="/Manager/check/news/:params" element={<CheckViewNews />} />
                </Route>
            </Routes>
        </BrowserRouter>
    </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();