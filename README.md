# TCC

Este repositório contém o código desenvolvido para o meu trabalho de conclusão de curso, um sistema onde pesquisadores podem armazenar, filtrar e visualizar bases de dados compartilhadas.

## Preparando

Primeiro precisamos criar um arquivo .env na raiz, com o seguinte formato:
```
MONGO_INITDB_ROOT_USERNAME=
MONGO_INITDB_ROOT_PASSWORD=
```
e outro .env em /api, com o seguinte formato:
```
MONGO_CONN_STRING=mongodb://{user}:{password}@mongo-db:27017/{db}
JWT_SECRET={secret}
```


## Rodando

Todas as partes do sistema rodam em containers docker, então basta rodar o comando abaixo para que o frontend, backend e banco de dados sejam criados:
```
docker compose up
```

### Exportar e Importar dados do mongo

Ao mover os containers de um host para outro, é possível que se precise mover os dados já inseridos no mongo, como tudo está rodando em containers, os dados estão salvos num volume chamado `mongo-db-volume`, configurado no arquivo `docker-compose.yml`.

Para exportar esses dados basta executar o seguinte comando com o container `mongo-db` já criado (feito automaticamente ao rodar o `docker compose up`):
```bash
docker run -i --rm --volumes-from mongo-db -v $(pwd)/mongo-db:/backup --link mongo-db --net default-network mongo bash -c 'mongodump -v --host mongo-db:27017 -u=admin -p=password --out=/backup'

# 1. O comando acima cria um container que se destrói após a criação (docker run -i --rm)
# 2. Este container vai usar os mesmos volumes do container mongo-db (--volumes-from mongo-db)
# 3. Este container vai ter um volume próprio, bindado ao diretório atual do usuário (-v $(pwd)/mongo-db:/backup)
# 4. Este container estará na mesma rede do container mongo-db, e criará um link para ele (--link mongo-db --net default-network)
# 5. E por último, esse container irá executar o mongodump no banco, extraindo os dados para o diretório local do usuário (mongo bash -c 'mongodump -v --host mongo-db:27017 -u=admin -p=password --out=/backup')
```

Após isso, podemos compactar/descompactar os dados exportados com:
```bash
tar -zcvf mongo-db-backup.tar

# Para descompactar basta trocar o c por x no comando acima
```

Para importar em outro container o comando é parecido, mas usaremos o mongorestore:
```bash
docker run -i --rm --volumes-from mongo-db -v $(pwd)/extract-dir:/backup --link mongo-db --net default-network mongo bash -c 'mongorestore --host mongo-db:27017 -u=admin -p=password /backup'

# Para usar este comando devemos extrair os dados do passo anterior num diretório, no caso acima chamado de extract-dir, isso irá importar os dados para o volume criado no docker-compose.yml
