import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Form,
  FormInstance,
  Input,
  Typography,
} from "antd";
import TextArea from "antd/lib/input/TextArea";
import { DebounceSelect } from "src/components/debounce-select.component";
import { CreateCommentDto } from "../store/comments.actions";
import { discussionsApi } from "src/pages/discussions/discussions.api";

const fetchDiscussionsByLabel = async (search: string) => {
  const discussions = await discussionsApi.fetchDiscussionsByLabel(search);
  return discussions.map((d) => ({
    value: `${d.id},${d.system}`,
    label: `${d.system} - ${d.label}`,
  }));
};

export const CommentFormCP = ({
  form,
  error,
  isEdit = false,
  editDiscussion,
}: {
  form: FormInstance<CreateCommentDto>;
  error: string | null;
  isEdit?: boolean;
  editDiscussion?: {
    value: string;
    label: string;
  };
}) => {
  return (
    <Form name="system-form" form={form} autoComplete="off" layout="vertical">
      {isEdit && (
        <Form.Item label="Id" name="id">
          <Input disabled={true} />
        </Form.Item>
      )}
      <Form.Item
        label="Discussão"
        name="discussionId"
        rules={[
          {
            required: true,
            message: "Preencha a discussão de onde comentário foi extraído!",
          },
        ]}
      >
        <DebounceSelect
          placeholder="Pesquisar discussões"
          fetchOptions={fetchDiscussionsByLabel}
          defaultOption={editDiscussion}
          onChange={(newValue) => {
            const [, system] = (newValue as { value: string }).value.split(",");
            form.setFieldsValue({ system });
          }}
        />
      </Form.Item>
      <Form.Item label="Data" name="date">
        <DatePicker style={{ width: "100%" }} />
      </Form.Item>
      <Form.Item
        label="Conteúdo"
        name="content"
        rules={[
          { required: true, message: "Preencha o conteúdo do comentário!" },
        ]}
      >
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
