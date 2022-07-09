import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { PageHeader, Button, Table, Popconfirm, Modal, Form } from "antd";
import { ColumnsType, TablePaginationConfig } from "antd/lib/table";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "src/config/store";
import styled from "styled-components";
import { DiscussionFormCP } from "./components/discussion-form.component";
import {
  createDiscussion,
  CreateDiscussionDto,
  deleteDiscussion,
  fetchDiscussions,
  updateDiscussion,
} from "./store/discussions.actions";
import {
  selectSaveDiscussionError,
  selectIsLoadingDiscussions,
  selectIsSavingDiscussion,
  selectDiscussions,
  clearDiscussionState,
  selectDiscussionsPageCount,
} from "./store/discussionsSlice";
import { IDiscussion } from "./types/discussion.model";

const ActionsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const columns: (
  onDelete: (id: string) => void,
  openForm: (id: string) => void
) => ColumnsType<IDiscussion> = (onDelete, openForm) => [
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
    title: "Descrição",
    dataIndex: "description",
    key: "description",
  },
  {
    title: "Extra",
    dataIndex: "extra",
    key: "extra",
    render: (value) => JSON.stringify(value),
  },
  {
    title: "Sistema",
    dataIndex: "system",
    key: "system",
    sorter: (a, b) => {
      if (a.system.toLowerCase() < b.system.toLowerCase()) {
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
    width: 132,
    render: (_, { id }) => (
      <ActionsContainer>
        <Button onClick={() => openForm(id)}>
          <EditOutlined />
        </Button>
        <Popconfirm
          title="Tem certeza que deseja deletar este discussão?"
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

export const DiscussionsCT = () => {
  const dispatch = useAppDispatch();

  const discussions = useSelector(selectDiscussions);
  const isLoading = useSelector(selectIsLoadingDiscussions);
  const isSaving = useSelector(selectIsSavingDiscussion);
  const pageCount = useSelector(selectDiscussionsPageCount);
  const error = useSelector(selectSaveDiscussionError);

  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editing, setEditing] = useState<IDiscussion | null>(null);
  const [checkForm, setCheckForm] = useState(false);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 100,
    total: 1000,
  });

  const [form] = Form.useForm();

  const onDelete = useCallback(
    (id: string) => {
      dispatch(deleteDiscussion(id));
    },
    [dispatch]
  );

  const onSave = useCallback(
    (dto: CreateDiscussionDto) => {
      if (editing) {
        dispatch(
          updateDiscussion({ id: editing.id, updateDiscussionDto: dto })
        );
      } else {
        dispatch(createDiscussion(dto));
      }
      setCheckForm(true);
    },
    [editing, dispatch]
  );

  const openForm = useCallback(
    (id?: string) => {
      const discussionToEdit =
        discussions.find((discussion) => discussion.id === id) ?? null;
      setIsFormVisible(true);
      setEditing(discussionToEdit);
      if (discussionToEdit) {
        const { extra, ...values } = discussionToEdit;
        const reducedExtra = Object.entries(extra).reduce(
          (acc, [name, value]) => [...acc, { name, value }],
          [] as {}[]
        );
        form.setFieldsValue({ ...values, extra: reducedExtra });
      }
    },
    [discussions, form]
  );

  const closeForm = useCallback(() => {
    setIsFormVisible(false);
    setEditing(null);
    dispatch(clearDiscussionState());
    form.resetFields();
  }, [form, dispatch]);

  const handleSaveForm = useCallback(() => {
    form.submit();
    setTimeout(() => {
      const isValid = form.getFieldsError().every((i) => i.errors.length === 0);
      if (isValid) {
        const { extra, ...values } = form.getFieldsValue();
        const reducedExtra = extra.reduce(
          (acc: {}, curr: { name: string; value: string }) => ({
            ...acc,
            [curr.name]: curr.value,
          }),
          {}
        );
        onSave({ ...values, extra: reducedExtra });
      }
    });
  }, [form, onSave]);

  const handleTableChange = useCallback((pagination: TablePaginationConfig) => {
    const current = pagination.current ?? 1;
    const pageSize = pagination.pageSize ?? 100;

    setPagination((p) => ({ ...p, current, pageSize }));
  }, []);

  // Initial Fetch
  useEffect(() => {
    const currentPage = pagination.current ?? 1;
    const pageSize = pagination.pageSize ?? 100;
    const offset = (currentPage - 1) * pageSize;

    dispatch(
      fetchDiscussions({
        offset,
        limit: pageSize,
      })
    );
  }, [dispatch, pagination]);

  // Close form after save
  useEffect(() => {
    if (isSaving === "idle" && checkForm) {
      closeForm();
      setCheckForm(false);
    }
  }, [isSaving, checkForm, closeForm]);

  useEffect(() => {
    setPagination((pg) => ({ ...pg, total: pageCount * (pg.pageSize ?? 100) }));
  }, [pageCount]);

  return (
    <div>
      <PageHeader
        ghost={false}
        title="Discussões"
        subTitle="Agrupamento de comentários"
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
        pagination={pagination}
        dataSource={discussions}
        columns={columns(onDelete, openForm)}
        loading={isLoading === "loading"}
        scroll={{ x: 1000 }}
        onChange={handleTableChange}
      />
      <Modal
        title={editing ? "Editar discussão" : "Criar discussão"}
        visible={isFormVisible}
        onOk={handleSaveForm}
        onCancel={closeForm}
        confirmLoading={isSaving === "loading"}
        okText="Salvar"
        cancelText="Cancelar"
      >
        <DiscussionFormCP form={form} error={error} isEdit={editing !== null} />
      </Modal>
    </div>
  );
};
