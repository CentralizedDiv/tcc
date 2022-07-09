import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Form, FormInstance, Input, Typography } from "antd";
import TextArea from "antd/lib/input/TextArea";
import { CreateDiscussionDto } from "../store/discussions.actions";

export const DiscussionFormCP = ({
  form,
  error,
  isEdit = false,
}: {
  form: FormInstance<CreateDiscussionDto>;
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
        label="Sistema"
        name="system"
        rules={[{ required: true, message: "Preencha o nome do sistema!" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Nome"
        name="label"
        rules={[{ required: true, message: "Preencha o nome da discussão!" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item label="Descrição" name="description">
        <TextArea />
      </Form.Item>
      <div style={{ marginBottom: 12 }}>
        <Typography.Text>Extra</Typography.Text>
      </div>
      <Form.List name="extra">
        {(fields, { add, remove }, { errors }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <div
                key={key}
                style={{
                  marginBottom: 16,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <Form.Item
                  {...restField}
                  style={{ flex: 1, margin: 0 }}
                  name={[name, "name"]}
                  rules={[
                    {
                      required: true,
                      message: "Preencha o nome da propriedade",
                    },
                  ]}
                >
                  <Input placeholder="Nome" />
                </Form.Item>
                <Form.Item
                  {...restField}
                  style={{ flex: 1, margin: 0 }}
                  name={[name, "value"]}
                  rules={[
                    {
                      required: true,
                      message: "Preencha o valor da propriedade",
                    },
                  ]}
                >
                  <Input placeholder="Valor" />
                </Form.Item>
                <MinusCircleOutlined onClick={() => remove(name)} />
              </div>
            ))}
            <Form.Item>
              <Button
                type="dashed"
                style={{ width: "100%" }}
                onClick={() => add()}
                icon={<PlusOutlined />}
              >
                Adicionar propriedade extra
              </Button>
              <Form.ErrorList errors={errors} />
            </Form.Item>
          </>
        )}
      </Form.List>
      {error && <Typography.Text type="danger">{error}</Typography.Text>}
    </Form>
  );
};
