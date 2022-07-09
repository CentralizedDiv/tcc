import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { PageHeader, Button, Table, Popconfirm, Modal, Form } from "antd";
import { ColumnsType } from "antd/lib/table";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "src/config/store";
import styled from "styled-components";
import { SystemFormCP } from "./components/system-form.component";
import {
  createSystem,
  CreateSystemDto,
  deleteSystem,
  fetchSystems,
  updateSystem,
} from "./store/systems.actions";
import {
  selectSaveSystemError,
  selectIsLoadingSystems,
  selectIsSavingSystem,
  selectSystems,
  clearSystemState,
} from "./store/systemsSlice";
import { ISystem } from "./types/system.model";

const ActionsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const columns: (
  onDelete: (id: string) => void,
  openForm: (id: string) => void
) => ColumnsType<ISystem> = (onDelete, openForm) => [
  {
    title: "Nome",
    dataIndex: "label",
    key: "label",
    sorter: (a, b) => {
      if (a.label.toLowerCase() < b.label.toLowerCase()) {
        return -1;
      } else {
        return 1;
      }
    },
  },
  {
    title: "Ações",
    key: "operations",
    fixed: "right",
    width: 100,
    render: (_, { id }) => (
      <ActionsContainer>
        <Button onClick={() => openForm(id)}>
          <EditOutlined />
        </Button>
        <Popconfirm
          title="Tem certeza que deseja deletar este sistema?"
          onConfirm={() => onDelete(id)}
          okText="Sim"
          cancelText="Não"
          placement="left"
          arrowPointAtCenter={true}
        >
          <Button danger>
            <DeleteOutlined />
          </Button>
        </Popconfirm>
      </ActionsContainer>
    ),
  },
];

export const SystemsCT = () => {
  const dispatch = useAppDispatch();

  const systems = useSelector(selectSystems);
  const isLoading = useSelector(selectIsLoadingSystems);
  const isSaving = useSelector(selectIsSavingSystem);
  const error = useSelector(selectSaveSystemError);

  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editing, setEditing] = useState<ISystem | null>(null);
  const [checkForm, setCheckForm] = useState(false);

  const [form] = Form.useForm();

  const onDelete = useCallback(
    (id: string) => {
      dispatch(deleteSystem(id));
    },
    [dispatch]
  );

  const onSave = useCallback(
    (dto: CreateSystemDto) => {
      if (editing) {
        dispatch(updateSystem({ id: editing.id, updateSystemDto: dto }));
      } else {
        dispatch(createSystem(dto));
      }
      setCheckForm(true);
    },
    [editing, dispatch]
  );

  const openForm = useCallback(
    (id?: string) => {
      const systemToEdit = systems.find((system) => system.id === id) ?? null;
      setIsFormVisible(true);
      setEditing(systemToEdit);
      if (systemToEdit) {
        form.setFieldsValue(systemToEdit);
      }
    },
    [systems, form]
  );

  const closeForm = useCallback(() => {
    setIsFormVisible(false);
    setEditing(null);
    dispatch(clearSystemState());
    form.resetFields();
  }, [form, dispatch]);

  const handleSaveForm = useCallback(() => {
    form.submit();
    const isValid = form.getFieldsError().every((i) => i.errors.length === 0);
    if (isValid) {
      onSave(form.getFieldsValue());
    }
  }, [form, onSave]);

  useEffect(() => {
    dispatch(fetchSystems());
  }, [dispatch]);

  useEffect(() => {
    if (isSaving === "idle" && checkForm) {
      closeForm();
      setCheckForm(false);
    }
  }, [isSaving, checkForm, closeForm]);

  return (
    <div>
      <PageHeader
        ghost={false}
        title="Sistemas"
        subTitle="Site/Fórum de onde as discussões foram extraídas"
        extra={[
          <Button
            type="primary"
            icon={<PlusOutlined />}
            key="1"
            onClick={() => openForm()}
          >
            Criar
          </Button>,
        ]}
      />
      <Table
        rowKey={"id"}
        dataSource={systems}
        columns={columns(onDelete, openForm)}
        loading={isLoading === "loading"}
      />
      <Modal
        title={editing ? "Editar sistema" : "Criar sistema"}
        visible={isFormVisible}
        onOk={handleSaveForm}
        onCancel={closeForm}
        confirmLoading={isSaving === "loading"}
        okText="Salvar"
        cancelText="Cancelar"
      >
        <SystemFormCP form={form} error={error} isEdit={editing !== null} />
      </Modal>
    </div>
  );
};
