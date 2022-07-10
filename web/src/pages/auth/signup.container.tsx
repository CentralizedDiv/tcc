import { Form, Input, Button } from "antd";
import { login } from "./store/auth.actions";
import { useAppDispatch } from "src/config/store";
import { useSelector } from "react-redux";
import { selectUser } from "./store/authSlice";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LockOutlined, UserOutlined } from "@ant-design/icons";

export const SignupCT = () => {
  const user = useSelector(selectUser);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const onFinish = (values: any) => {
    dispatch(login(values));
  };

  useEffect(() => {
    if (user) navigate("/discussions", { replace: true });
  }, [user, navigate]);

  return (
    <div>
      <Form
        name="login"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          name="email"
          rules={[{ required: true, message: "Please input your email!" }]}
        >
          <Input
            prefix={<UserOutlined style={{ color: "rgba(0, 0, 0, 0.25)" }} />}
            placeholder="Email"
          />
        </Form.Item>

        <Form.Item
          name="name"
          rules={[{ required: true, message: "Please input your name!" }]}
        >
          <Input
            prefix={<UserOutlined style={{ color: "rgba(0, 0, 0, 0.25)" }} />}
            placeholder="Name"
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password
            prefix={<LockOutlined style={{ color: "rgba(0, 0, 0, 0.25)" }} />}
            placeholder="Password"
          />
        </Form.Item>

        <Form.Item
          name="confirm-password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password
            prefix={<LockOutlined style={{ color: "rgba(0, 0, 0, 0.25)" }} />}
            placeholder="Confirm password"
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
