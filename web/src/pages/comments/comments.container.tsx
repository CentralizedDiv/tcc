import {
  ClearOutlined,
  DeleteOutlined,
  EditOutlined,
  FilterOutlined,
  PlayCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  PageHeader,
  Button,
  Table,
  Popconfirm,
  Modal,
  Form,
  Typography,
  Space,
} from "antd";
import TextArea from "antd/lib/input/TextArea";
import { ColumnsType, TablePaginationConfig } from "antd/lib/table";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "src/config/store";
import styled from "styled-components";
import { discussionsApi } from "../discussions/discussions.api";
import { CommentFormCP } from "./components/comment-form.component";
import {
  createComment,
  CreateCommentDto,
  deleteComment,
  fetchComments,
  updateComment,
} from "./store/comments.actions";
import {
  selectSaveCommentError,
  selectIsLoadingComments,
  selectIsSavingComment,
  selectComments,
  clearCommentState,
  selectCommentsPageCount,
} from "./store/commentsSlice";
import { IComment } from "./types/comment.model";

const DEFAULT_PAGE_SIZE = 10;

const ActionsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const columns: (
  onDelete: (id: string) => void,
  openForm: (id: string) => void
) => ColumnsType<IComment> = (onDelete, openForm) => [
  {
    title: "Conteúdo",
    dataIndex: "content",
    key: "content",
  },
  {
    title: "Data",
    dataIndex: "date",
    key: "date",
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
          title="Tem certeza que deseja apagar este comentário?"
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

export const CommentsCT = () => {
  const dispatch = useAppDispatch();

  const comments = useSelector(selectComments);
  const isLoading = useSelector(selectIsLoadingComments);
  const isSaving = useSelector(selectIsSavingComment);
  const pageCount = useSelector(selectCommentsPageCount);
  const error = useSelector(selectSaveCommentError);

  const [query, setQuery] = useState("");
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isQueryEditorVisible, setQueryEditorVisible] = useState(false);
  const [editing, setEditing] = useState<IComment | null>(null);
  const [editingDiscussion, setEditingDiscussion] = useState<{
    value: string;
    label: string;
  }>();
  const [checkForm, setCheckForm] = useState(false);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    total: 0,
  });

  const [form] = Form.useForm();

  const onDelete = useCallback(
    (id: string) => {
      dispatch(deleteComment(id));
    },
    [dispatch]
  );

  const onSave = useCallback(
    (dto: CreateCommentDto) => {
      if (editing) {
        dispatch(updateComment({ id: editing.id, updateCommentDto: dto }));
      } else {
        dispatch(createComment(dto));
      }
      setCheckForm(true);
    },
    [editing, dispatch]
  );

  const openForm = useCallback(
    async (id?: string) => {
      const commentToEdit =
        comments.find((comment) => comment.id === id) ?? null;
      if (commentToEdit) {
        const discussion = await discussionsApi.fetchDiscussionsById(
          commentToEdit.discussionId
        );
        const editingDiscussion = {
          value: `${discussion.id},${discussion.system}`,
          label: `${discussion.system} - ${discussion.label}`,
        };
        setEditingDiscussion(editingDiscussion);
        const { extra, ...values } = commentToEdit;
        const reducedExtra = Object.entries(extra ?? {}).reduce(
          (acc, [name, value]) => [...acc, { name, value }],
          [] as {}[]
        );
        form.setFieldsValue({
          ...values,
          discussionId: editingDiscussion,
          date: moment(values.date),
          extra: reducedExtra,
        });
      }
      setIsFormVisible(true);
      setEditing(commentToEdit);
    },
    [comments, form]
  );

  const closeForm = useCallback(() => {
    setIsFormVisible(false);
    setEditing(null);
    setEditingDiscussion(undefined);
    dispatch(clearCommentState());
    form.resetFields();
  }, [form, dispatch]);

  const handleSaveForm = useCallback(() => {
    form.submit();
    setTimeout(() => {
      const isValid = form.getFieldsError().every((i) => i.errors.length === 0);
      if (isValid) {
        const { extra, ...values } = form.getFieldsValue();
        const reducedExtra = (extra ?? []).reduce(
          (acc: {}, curr: { name: string; value: string }) => ({
            ...acc,
            [curr.name]: curr.value,
          }),
          {}
        );
        const [discussionId, system] = values.discussionId.value.split(",");
        onSave({ ...values, discussionId, system, extra: reducedExtra });
      }
    });
  }, [form, onSave]);

  const handleTableChange = useCallback((pagination: TablePaginationConfig) => {
    const current = pagination.current ?? 1;
    const pageSize = pagination.pageSize ?? DEFAULT_PAGE_SIZE;

    setPagination((p) => ({ ...p, current, pageSize }));
  }, []);

  // Initial Fetch
  useEffect(() => {
    if (!query) {
      const currentPage = pagination.current ?? 1;
      const pageSize = pagination.pageSize ?? DEFAULT_PAGE_SIZE;
      const offset = (currentPage - 1) * pageSize;

      dispatch(
        fetchComments({
          offset,
          limit: pageSize,
        })
      );
    }
  }, [dispatch, pagination, query]);

  // Close form after save
  useEffect(() => {
    if (isSaving === "idle" && checkForm) {
      closeForm();
      setCheckForm(false);
    }
  }, [isSaving, checkForm, closeForm]);

  useEffect(() => {
    setPagination((pg) => ({
      ...pg,
      total: pageCount * (pg.pageSize ?? DEFAULT_PAGE_SIZE),
    }));
  }, [pageCount]);

  return (
    <div>
      <PageHeader
        ghost={false}
        title="Comentários"
        extra={[
          <Button
            type="primary"
            ghost
            icon={<FilterOutlined />}
            key="1"
            onClick={() => setQueryEditorVisible((v) => !v)}
          >
            Filtrar
          </Button>,
          <Button
            type="primary"
            icon={<PlusOutlined />}
            key="2"
            onClick={() => openForm()}
          >
            Criar
          </Button>,
        ]}
      />
      {isQueryEditorVisible && (
        <div
          style={{
            padding: "12px 24px",
            backgroundColor: "#fff",
            borderTop: "1px solid rgba(0,0,0,.06)",
          }}
        >
          <Typography.Title level={5}>Editor de Query</Typography.Title>
          <TextArea
            value={query}
            onInput={(v) => setQuery(v.currentTarget.value)}
            style={{ borderRadius: 4, marginBottom: 12 }}
            placeholder="{ $and: [ { system: 'REDDIT' }, { date: { $gte: '2022-07-01' } } ] }"
          />
          <Space>
            <Button
              type="primary"
              disabled={!query}
              loading={isSaving === "loading"}
              icon={<PlayCircleOutlined />}
              onClick={() => {
                const currentPage = pagination.current ?? 1;
                const pageSize = pagination.pageSize ?? DEFAULT_PAGE_SIZE;
                const offset = (currentPage - 1) * pageSize;

                dispatch(
                  fetchComments({
                    offset,
                    limit: pageSize,
                    query,
                  })
                );
              }}
            >
              Executar Query
            </Button>
            <Button
              type="primary"
              disabled={isSaving === "loading"}
              ghost
              icon={<ClearOutlined />}
              onClick={() => {
                setQuery("");
                setPagination((p) => ({ ...p, current: 1 }));
              }}
            >
              Limpar filtro
            </Button>
          </Space>
          {error && (
            <div style={{ marginTop: 8 }}>
              <Typography.Text type="danger">{error}</Typography.Text>
            </div>
          )}
        </div>
      )}
      <Table
        rowKey={"id"}
        pagination={pagination}
        dataSource={comments}
        columns={columns(onDelete, openForm)}
        loading={isLoading === "loading"}
        scroll={{ x: 1000 }}
        onChange={handleTableChange}
      />
      <Modal
        title={editing ? "Editar comentário" : "Criar comentário"}
        visible={isFormVisible}
        onOk={handleSaveForm}
        onCancel={closeForm}
        confirmLoading={isSaving === "loading"}
        okText="Salvar"
        cancelText="Cancelar"
      >
        <CommentFormCP
          form={form}
          error={error}
          isEdit={editing !== null}
          editDiscussion={editingDiscussion}
        />
      </Modal>
    </div>
  );
};
