# Instalação 

- VSCODE
- node 

# Criando primeiro servidor

Instale o Express:

~~~bash
npm install express
~~~

Crie o arquivo do servidor: No mesmo diretório, crie um arquivo server.js com o seguinte código:

~~~javascript
const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.send('Olá, mundo! Este é um servidor Node.js com Express.');
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}/`);
});
~~~

Inicie o servidor: Execute:

~~~bash
node server.js
~~~

Acesse o servidor no navegador em http://localhost:3000.


