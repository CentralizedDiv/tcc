import { Form, FormInstance, Input, Typography } from "antd";
import { CreateSystemDto } from "../store/systems.actions";

export const SystemFormCP = ({
  form,
  error,
  isEdit = false,
}: {
  form: FormInstance<CreateSystemDto>;
  error: string | null;
  isEdit?: boolean;
}) => {
  return (
    <Form name="system-form" form={form} autoComplete="off" layout="vertical">
      {isEdit && (
        <Form.Item label="Id" name="id">
          <Input disabled={true} />
        </Form.Item>
      )}
      <Form.Item
        label="Nome"
        name="label"
        rules={[{ required: true, message: "Preencha o nome do sistema!" }]}
      >
        <Input />
      </Form.Item>
      {error && <Typography.Text type="danger">{error}</Typography.Text>}
    </Form>
  );
};
