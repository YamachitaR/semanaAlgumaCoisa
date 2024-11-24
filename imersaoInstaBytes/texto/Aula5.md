# Deixando nossa pasta acessível 

Para deixar nosso arquivo do diretório `uploads` acessivel vamos no arquivo `server.js` adicionaremos `app.use(express.static("uploads"))`

~~~js
const app = express();
app.use(express.static("uploads"))
routes(app)
~~~

Para testar
~~~
localhost:3000/id.png
~~~

# Atualizar

Vamos adicionar a função para atualizar 

## `postsRoutes.js`

~~~js
. . .
import { listarPosts, postarNovoPost, uploadImagem, atualizarNovoPost } from "../controllers/postsController.js"; 
. ...

const routes = (app) => {
...

 app.put("/upload/:id", atualizarNovoPost);

};    

~~~

## `postsController.js`

~~~js
export async function atualizarNovoPost(req, res) {
    const id = req.params.id; // pegando id que queremos atualizar
    const urlImagem = `http://localhost:3000/${id}.png`
    const post = {
        imgUrl: urlImagem,
        descricao: req.body.descricao,
        alt: req.body.alt
    }

    try {
        const postCriado = await  atualizarPost(id, post);
        res.status(200).json(postCriado);  
    } catch(erro) {
        console.error(erro.message);
        res.status(500).json({"Erro":"Falha na requisição"});
    }
}
~~~


## `postModels.js`

~~~js
export async function atualizarPost(id, novoPost) {
    const db = conexao.db("imersao-instabyte");
    const colecao = db.collection("posts");
    const objID = ObjectId.createFromHexString(id); // para achar id que queremos atualizar
    return colecao.updateOne({_id: new ObjectId(objID)}, {$set:novoPost});
}
~~~


## Testando nossa aplicação 

Enviar um arquivo como mencionado na aula 4.

Abra outra aba do POSTMAN


- Coloque metodo `PUT`
-  http://localhost:3000/ + id que vc quer modificar 
- Opção:Body
- Opção: raw
- Opção: json 

 ~~~
{
    "descricao": "sou novo descricao",
    "alt": "fui modificado"
}
~~~

![alt text](image-13.png)


Para verificar se realmente teve alteração user metodo `GET` e  `http://localhost:3000/posts`



# Adicionar Gemini para gerar o texto da descrição 

## Criando arquivo `services/geminiService.js`

~~~js
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export default async function gerarDescricaoComGemini(imageBuffer) {
  const prompt =
    "Gere uma descrição em português do brasil para a seguinte imagem";

  try {
    const image = {
      inlineData: {
        data: imageBuffer.toString("base64"),
        mimeType: "image/png",
      },
    };
    const res = await model.generateContent([prompt, image]);
    return res.response.text() || "Alt-text não disponível.";
  } catch (erro) {
    console.error("Erro ao obter alt-text:", erro.message, erro);
    throw new Error("Erro ao obter o alt-text do Gemini.");
  }
}
~~~


## .Env 

Adicione a chave 
~~~
GEMINI_API_KEY = Key
~~~


## Gerando a chave 

[https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)

## `postsController.js

~~~js
import gerarDescricaoComGemini from "../services/geminiService.js"

... 
//atualizamos algumas coisas
export async function atualizarNovoPost(req, res) {
    const id = req.params.id;
    const urlImagem = `http://localhost:3000/${id}.png`
    try {
        const imgBuffer = fs.readFileSync(`uploads/${id}.png`) //novo
        const descricao = await gerarDescricaoComGemini(imgBuffer) //novo

        //mudou 
        const post = {
            imgUrl: urlImagem,
            descricao: descricao,
            alt: req.body.alt
        }

        const postCriado = await atualizarPost(id, post);
        res.status(200).json(postCriado);  
    } catch(erro) {
        console.error(erro.message);
        res.status(500).json({"Erro":"Falha na requisição"});
    }
}
~~~

## Instale 
~~~
npm i @google/generative-ai
~~~

## testando 

sobe o servidor 
~~~
npm  run dev
~~~

no postman