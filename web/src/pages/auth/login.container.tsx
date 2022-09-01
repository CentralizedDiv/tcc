import { Form, Input, Button } from "antd";
import { login } from "./store/auth.actions";
import { useAppDispatch } from "src/config/store";
import { useSelector } from "react-redux";
import { clearError, selectAccountCreated, selectUser } from "./store/authSlice";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LockOutlined, UserOutlined } from "@ant-design/icons";

export const LoginCT = () => {
  const user = useSelector(selectUser);
  const accountCreated = useSelector(selectAccountCreated);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [showAccountCreated, setAC] = useState(false)

  console.log("Login", showAccountCreated)

  const onFinish = (values: any) => {
    dispatch(login(values));
  };

  useEffect(() => {
    if (user) navigate("/discussions", { replace: true });
  }, [user, navigate]);
  
  useEffect(() => {
    if(accountCreated) {
      setAC(true)
    }
    dispatch(clearError)
  }, [dispatch, accountCreated])

  useEffect(() => {
    if(showAccountCreated) {
      setAC(false)
      alert("Conta criada!")
    }
  }, [showAccountCreated])

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
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password
            prefix={<LockOutlined style={{ color: "rgba(0, 0, 0, 0.25)" }} />}
            placeholder="Password"
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
