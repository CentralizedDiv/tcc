import { ImportOutlined, InboxOutlined } from "@ant-design/icons";
import {
  Button,
  message,
  PageHeader,
  Typography,
  UploadFile,
  UploadProps,
} from "antd";
import Dragger from "antd/lib/upload/Dragger";
import { useCallback, useState } from "react";
import { commentsApi } from "../comments/comment.api";

export const ImportDataCT = () => {
  const [fileList, setFileList] = useState<UploadFile<any>[]>([]);
  const [commentsToImport, setCommentsToImport] = useState<any[]>([]);

  const props: UploadProps = {
    name: "file",
    multiple: true,
    action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
    onChange(info) {
      setFileList(info.fileList);
      const { status } = info.file;
      if (status === "done") {
        message.success(`Upload de ${info.file.name} feito com sucesso.`);
        let reader = new FileReader();
        reader.onload = () => {
          const comments = (reader.result as string)
            .split("\n")
            .map((c) => JSON.parse(c));
          setCommentsToImport((c) => [...c, ...comments]);
        };
        reader.readAsText(info.file.originFileObj as Blob);
      } else if (status === "error") {
        message.error(`Falha ao fazer o upload de ${info.file.name}.`);
      }
    },
  };

  const importData = useCallback(async () => {
    if (commentsToImport.length > 0) {
      try {
        await commentsApi.createBatchComments(commentsToImport);
        message.success(`Import feito com sucesso!`);
        setFileList([]);
      } catch {
        message.error(`Falha ao importar!`);
      }
      setCommentsToImport([]);
    }
  }, [commentsToImport]);

  return (
    <div>
      <PageHeader
        ghost={false}
        title="Importar comentários"
        subTitle="Faça o upload de arquivos jsonlines no formato adequado"
      />
      <div style={{ padding: 24, backgroundColor: "#fff" }}>
        <Dragger {...props} fileList={fileList}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">
            Clique ou arraste arquivos nesta área para fazer upload
          </p>
          <p className="ant-upload-hint">
            É possível selecionar múltiplos arquivos
          </p>
        </Dragger>
        <div style={{ marginTop: 12 }}>
          <Typography.Title level={5}>Preview Document</Typography.Title>
          {commentsToImport.length > 0 ? (
            <pre>{JSON.stringify(commentsToImport[0], null, 2)}</pre>
          ) : (
            <pre>{"{}"}</pre>
          )}
        </div>
        <Button
          type="primary"
          icon={<ImportOutlined />}
          disabled={commentsToImport.length === 0}
          style={{ marginTop: 12 }}
          onClick={importData}
        >
          Import Data
        </Button>
      </div>
    </div>
  );
};
