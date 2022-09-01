import { Layout, Menu, Modal } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Navigate,
  useLocation,
  useNavigate,
  useOutlet,
} from "react-router-dom";
import { selectAccountCreated, selectUser, unauthenticate } from "src/pages/auth/store/authSlice";
import {
  CommentOutlined,
  SnippetsOutlined,
  DesktopOutlined,
  UserOutlined,
  ExclamationCircleOutlined,
  EditOutlined,
  LogoutOutlined,
  ImportOutlined,
} from "@ant-design/icons";
import styled from "styled-components";
import { useAppDispatch } from "src/config/store";

const { Header, Content, Sider } = Layout;

const { confirm } = Modal;

const showConfirm = (onOk: () => void) => {
  confirm({
    title: "Você deseja sair?",
    icon: <ExclamationCircleOutlined />,
    content: "Você será redirecionado para a tela de login.",
    onOk,
  });
};

const Logo = styled.div<{ collapsed: boolean }>`
  height: 32px;
  margin: 14px;
  background: rgba(255, 255, 255, 0.3);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;

  ${({ collapsed }) => (collapsed ? "font-weight: bold" : "font-size: 10px")}
`;

function getItem(label?: any, key?: any, icon?: any, children?: any) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const items = [
  getItem("Discussões", "/discussions", <SnippetsOutlined />),
  getItem("Comentários", "/comments", <CommentOutlined />),
  getItem("Sistemas", "/systems", <DesktopOutlined />),
  getItem("Importar", "/import", <ImportOutlined />),
];

export const ProtectedLayout = () => {
  const location = useLocation();
  const outlet = useOutlet();
  const user = useSelector(selectUser);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [collapsed, setCollapsed] = useState(false);
  const [debCollapsed, setDebCollapsed] = useState(false);

  useEffect(() => {
    if (collapsed) {
      setDebCollapsed(collapsed);
    } else {
      setTimeout(() => {
        setDebCollapsed(collapsed);
      }, 200);
    }
  }, [collapsed]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Layout
      style={{
        minHeight: "100vh",
      }}
    >
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <Logo collapsed={debCollapsed}>
          {debCollapsed ? "ODD" : "Online Discussions Database"}
        </Logo>
        <Menu
          theme="dark"
          selectedKeys={[location.pathname]}
          onClick={({ key }) => navigate(key)}
          mode="inline"
          items={items}
        />
      </Sider>
      <Layout className="site-layout">
        <Header
          className="site-layout-background"
          style={{
            padding: 0,
          }}
        >
          <Menu
            theme="dark"
            mode="horizontal"
            selectedKeys={[]}
            triggerSubMenuAction="click"
            items={[
              {
                label: user.name,
                key: "user-menu",
                icon: <UserOutlined />,
                children: [
                  {
                    key: "profile",
                    label: "Editar",
                    icon: <EditOutlined />,
                    onClick: () => navigate("/profile"),
                  },
                  {
                    key: "logout",
                    label: "Logout",
                    icon: <LogoutOutlined />,
                    onClick: () =>
                      showConfirm(() => {
                        dispatch(unauthenticate());
                      }),
                  },
                ],
              },
            ]}
            style={{ justifyContent: "flex-end" }}
          />
        </Header>
        <Content
          style={{
            margin: "0 16px",
          }}
        >
          <div
            className="site-layout-background"
            style={{
              padding: 24,
              minHeight: 360,
            }}
          >
            {outlet}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};
