import { Menu } from "antd";
import { useSelector } from "react-redux";
import {
  Navigate,
  useLocation,
  useNavigate,
  useOutlet,
} from "react-router-dom";
import { selectUser } from "src/pages/auth/store/authSlice";
import styled from "styled-components";
import { UserAddOutlined, LoginOutlined } from "@ant-design/icons";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

export const PublicLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const outlet = useOutlet();

  if (user) {
    return <Navigate to="/discussions" replace />;
  }

  return (
    <Container>
      <h1 style={{ marginBottom: 32 }}>Online Discussions Database</h1>
      <Menu
        theme="light"
        mode="horizontal"
        selectedKeys={[location.pathname]}
        triggerSubMenuAction="click"
        onClick={({ key }) => navigate(key)}
        items={[
          {
            label: "Login",
            key: "/login",
            icon: <LoginOutlined />,
          },
          {
            label: "Create Account",
            key: "/signup",
            icon: <UserAddOutlined />,
          },
        ]}
        style={{ justifyContent: "center", width: 380, marginBottom: 24 }}
      />
      <div style={{ width: 350 }}>{outlet}</div>
    </Container>
  );
};
