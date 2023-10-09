require("reflect-metadata");
const express = require("express");
const { createConnection } = require("typeorm");
const cors = require('cors');

const app = express();
const port = 3001;

let connectionPromise = null;

app.use(cors());

app.use(express.json());

app.post("/login", async (req, res) => {
    try {
        if (!connectionPromise) {
            connectionPromise = await createConnection({
                type: "postgres",
                host: "localhost",
                port: 5432,
                username: "postgres",
                password: "880708",
                database: "postgres",
                logging: true
            });
        }

        const connection = await connectionPromise;
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({ error: "E-mail e senha são obrigatórios." });
        }

        const user = await connection.query("SELECT * FROM beaba.usuario WHERE email = $1", [email]);

        if (user.length === 0) {
            return res.status(401).json({ error: "Usuário não encontrado." });
        }

        if (senha === user[0].senha) {
            res.json({ authenticated: true, user: { nome: user[0].nome, email: user[0].email, perfil: user[0].perfil } });
        } else {
            res.status(401).json({ authenticated: false, error: "Credenciais inválidas." });
        }
    } catch (error) {
        console.error("Erro ao fazer login: ", error);
        res.status(500).json({ error: "Erro ao processar a solicitação." });
    }
});

app.get("/users", async (req, res) => {
    try {
        if (!connectionPromise) {
            connectionPromise = await createConnection({
                type: "postgres",
                host: "localhost",
                port: 5432,
                username: "postgres",
                password: "880708",
                database: "postgres",
                logging: true
            });
        }
        const connection = await connectionPromise;
        const queryResult = await connection.query("SELECT * FROM beaba.usuario");
        res.json(queryResult);
    } catch (error) {
        console.error("Erro ao obter usuário: ", error);
        res.status(500).json({ error: "Erro ao processar a solicitação" });
    }
});

app.post("/usuario/cadastro", async (req, res) => {
    try {
        if (!connectionPromise) {
            connectionPromise = await createConnection({
                type: "postgres",
                host: "localhost",
                port: 5432,
                username: "postgres",
                password: "postgres",
                database: "postgres",
                logging: true
            });
        }
        const connection = await connectionPromise;

        const { nome, email, senha, perfil } = req.body;

        if (!nome || !email || !senha || !perfil) {
            return res.status(400).json({ error: "Todos os campos são obrigatórios." });
        }

        const queryResult = await connection.query(
            "INSERT INTO beaba.usuario (nome, email, senha, perfil) VALUES ($1, $2, $3, $4)",
            [nome, email, senha, perfil]
        );

        res.status(200).json({ message: "Usuário cadastrado com sucesso."});
    } catch (error) {
        console.error("Erro ao cadastrar usuário: ", error);
        res.status(500).json({ error: "Erro ao processar a solicitação" });
    }
});

createConnection({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "880708",
    database: "postgres",
    logging: true
}).then((createdConnection) => {
    connectionPromise = Promise.resolve(createdConnection);
    app.listen(port, () => {
        console.log(`Server conectado em: http://localhost:${port}`);
    });
}).catch(error => console.log("TypeORM connection error: ", error));