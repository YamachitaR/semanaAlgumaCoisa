# Conectando sua API ao MongoDB


## Cadastro no site MongoDB Atlas

Entre no site [https://www.mongodb.com/products/platform/atlas-database](https://www.mongodb.com/products/platform/atlas-database)


A parte que precisamos presta mais atenção é no:

![alt text](image.png)

Desmarque, ele serve para subir um banco de dados com alguns dados. 

![alt text](image-1.png)


Nessa etapa, importante salvar login e a senha. 
![alt text](image-2.png)


Erro comum aperta botão errado para ir na próxima etapa (aperte o verde)
![alt text](image-3.png)


Esolhemos Drives 
![alt text](image-4.png)


Guarda a chave
![alt text](image-5.png)


## Criando DataBase

Ainda no site, 
![alt text](image-6.png)

Depois:

![alt text](image-7.png)

Preencha o campo:

- Database name: imersao-instabyte
- Collection name: posts

" Como nossa Database fosse o armário e Collection fosse nossa gaveta, dentro da nossa coleções nos guarda nosso objeto" André David

Depois click 
- create 
- Insert Document

![alt text](image-8.png)

Click `insert`

Inserir mais elemento para ficar mais interessante, para isso basta clicar em clonar

## No terminal 
~~~
npm install mongodb
~~~

## Configurando .env

Crie o arquivo `.env`  na raiz 

~~~
STRING_CONEXAO=mongodb+srv: é chave que foi adquirido no site (veja se ele já esta com a senha)
~~~


##  Configurando `package.json`

Adicione:   `node --watch --env-file=.env server.js`   no `DEV` do bloco `script` 

~~~
"contributors": [],
  "scripts": {
    "dev": "node --watch --env-file=.env server.js",
    "test": ""
},
~~~

notas: 
- `--watch`: vai servir para que sempre foi modificador o nosso serve não precisar derrubando e subindo;
- `--env-file=.env`: reconhecer nosso arquivo `.env` 
- `server.js`: nosso arquivo principal 


Agora para roda nosso servidor basta fazer
~~~
npm run dev
~~~

Mas antes de rodar, vamos ver ser ele esta pegando o valor do `.env`

Para isso adicione a linha, mas não esqueça de remover depois 
~~~js
console.log(process.env.STRING_CONEXAO)
~~~

## Criando a conexão


Antes de começar a criar a conexão, vamos organizar, crie diretório `src` 
dentro do `src`crie o diretório `config` e dentro do `config` crie um arquivo chamado `dbConfig.js`

Dentro do arquivo `dbConfig.js`

~~~js
import { MongoClient } from 'mongodb';

export default async function conectarAoBanco(stringConexao) {
    let mongoClient;

    try {
        mongoClient = new MongoClient(stringConexao);
        console.log('Conectando ao cluster do banco de dados...');
        await mongoClient.connect();
        console.log('Conectado ao MongoDB Atlas com sucesso!');

        return mongoClient;
    } catch (erro) {
        console.error('Falha na conexão com o banco!', erro);
        process.exit();
    }
}
~~~

Dentro no nosso arquivo `server.js` vamos inserir 

~~~ js
import conectarAoBanco from "./src/config/dbConfig.js";

await conectarAoBanco(process.env.STRING_CONEXAO)
~~~

Vai servir para verificar se foi conectado corretamente 



## Pegando todos os post 


No arquivo `server.js` que esta na raiz do nosso projeto 

~~~ js
import express from "express";
import conectarAoBanco from "./src/config/dbConfig.js";

// que vai fazer a conexão
const conexao = await conectarAoBanco(process.env.STRING_CONEXAO)

const app = express();
app.use(express.json());

app.listen(3000, () => {
    console.log("Servidor escutando...");
});

// a função que vai pegar todos as nosso post 
async function getTodosPosts() {
    const db = conexao.db("imersao-instabyte")
    const colecao = db.collection("posts")
    return colecao.find().toArray()
}

// Repare no async(req, res) é importante 
app.get("/posts", async(req, res) => {
    const posts = await getTodosPosts() 
    res.status(200).json(posts);
});
~~~

## Refatorando o código 

Vamos criar vários arquivos:

`src/routes/postRoutes.js`

Aqui como o nome já diz, vai ficar a nossa Rota, caminho da urls
~~~js
import express from "express";
import { listarPosts } from "../controllers/postsController.js";

const routes = (app) => {
    app.use(express.json());
    
    app.get("/posts", listarPosts);
}

export default routes;
~~~

`src/controllers/postControler.js`

Aqui vamos ter o controler no sentido acesso, ao entrar na rota `posts`vai ser exercutado a função `listarPosts`:

~~~js
import { getTodosPosts } from "../models/postsModels.js";

export async function listarPosts (req, res)
{
    const posts =  await getTodosPosts();
    res.status(200).json(posts);
}
~~~

`src/models/postsModels.js`
Aqui vai ficar relacionado o banco de dados

~~~js
import conectarAoBanco from "../config/dbConfig.js";

const conexao = await conectarAoBanco(process.env.STRING_CONEXAO);

export async function getTodosPosts(){
    const db = conexao.db("imersao-instabytes");
    const colecao = db.collection("posts");
    return colecao.find().toArray();
}
~~~