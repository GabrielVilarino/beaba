require('reflect-metadata');
const express = require('express');
const { createConnection } = require('typeorm');
const cors = require('cors');

const app = express();
const port = 3001;

let connectionPromise = null;

app.use(cors());

app.use(express.json());

app.post('/login', async (req, res) => {
  try {
    if (!connectionPromise) {
      connectionPromise = await createConnection({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: '880708',
        database: 'postgres',
        logging: true
      });
    }

    const connection = await connectionPromise;
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ error: 'E-mail e senha são obrigatórios.' });
    }

    const user = await connection.query('SELECT * FROM beaba.usuario WHERE email = $1', [email]);

    if (user.length === 0) {
      return res.status(401).json({ error: 'Usuário não encontrado.' });
    }

    if (senha === user[0].senha) {
      res.json({ authenticated: true, user: { nome: user[0].nome, email: user[0].email, perfil: user[0].perfil, id: user[0].id, idsquad: user[0].idsquad } });
    } else {
      res.status(401).json({ authenticated: false, error: 'Credenciais inválidas.' });
    }
  } catch (error) {
    console.error('Erro ao fazer login: ', error);
    res.status(500).json({ error: 'Erro ao processar a solicitação.' });
  }
});

app.get('/usuarios', async (req, res) => {
  try {
    if (!connectionPromise) {
      connectionPromise = await createConnection({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: '880708',
        database: 'postgres',
        logging: true
      });
    }
    const connection = await connectionPromise;
    const queryResult = await connection.query(`
        SELECT u.*,
            s.nome as nomeSquad
        FROM 
            beaba.usuario u
        LEFT JOIN
            beaba.squad s
        ON
            u.idSquad = s.id
        GROUP BY
            u.id, s.id
        ORDER BY u.id ASC
    `);
    res.json(queryResult);
  } catch (error) {
    console.error('Erro ao obter usuário: ', error);
    res.status(500).json({ error: 'Erro ao processar a solicitação' });
  }
});

app.get('/usuario/nome', async (req, res) => {
  try {
    const userID = req.query.id;
    if(!userID) {
      return res.status(400).json({ error: 'O id é obrigatório.' });
    }

    if (!connectionPromise) {
      connectionPromise = await createConnection({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: '880708',
        database: 'postgres',
        logging: true
      });
    }
    const connection = await connectionPromise;
    const queryResult = await connection.query('SELECT nome FROM beaba.usuario WHERE id = $1', [userID]);

    if (queryResult.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    res.json(queryResult[0]);
  } catch (error) {
    console.error('Erro ao obter usuário: ', error);
    res.status(500).json({ error: 'Erro ao processar a solicitação' });
  }
});

app.get('/admin/email', async (req, res) => {
  try {
    const userIDSquad = req.query.idsquad;
    if(!userIDSquad) {
      return res.status(400).json({ error: 'O id da squad é obrigatório.' });
    }

    if (!connectionPromise) {
      connectionPromise = await createConnection({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: '880708',
        database: 'postgres',
        logging: true
      });
    }
    const connection = await connectionPromise;
    const queryResult = await connection.query(`
        SELECT 
            u.email, u.nome 
        FROM 
            beaba.usuario u
        JOIN
            beaba.squad s
        ON
            u.idSquad = s.id 
        WHERE 
            s.id = $1 and u.perfil = $2
    `, [userIDSquad, 'admin']);

    if (queryResult.length === 0) {
      return res.status(404).json({ error: 'Email não encontrado.' });
    }

    res.json(queryResult[0]);
  } catch (error) {
    console.error('Erro ao obter usuário: ', error);
    res.status(500).json({ error: 'Erro ao processar a solicitação' });
  }
});

app.post('/usuario/cadastro', async (req, res) => {
  try {
    if (!connectionPromise) {
      connectionPromise = await createConnection({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: 'postgres',
        database: 'postgres',
        logging: true
      });
    }
    const connection = await connectionPromise;

    const { nome, email, senha, perfil, squad } = req.body;

    if (!nome || !email || !senha || !perfil || !squad) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    const queryResult = await connection.query(
      'INSERT INTO beaba.usuario (nome, email, senha, perfil, idSquad) VALUES ($1, $2, $3, $4, $5)',
      [nome, email, senha, perfil, squad]
    );

    res.status(200).json({ message: 'Usuário cadastrado com sucesso.'});
  } catch (error) {
    console.error('Erro ao cadastrar usuário: ', error);
    res.status(500).json({ error: 'Erro ao processar a solicitação' });
  }
});

app.get('/usuario/perfil', async (req, res) => {
  try {
    const userEmail = req.query.email;
    if(!userEmail) {
      return res.status(400).json({ error: 'O e-mail é obrigatório.' });
    }

    if (!connectionPromise) {
      connectionPromise = await createConnection({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: '880708',
        database: 'postgres',
        logging: true
      });
    }
    const connection = await connectionPromise;
    const queryResult = await connection.query('SELECT nome, email, senha, id, perfil FROM beaba.usuario WHERE email = $1', [userEmail]);

    if (queryResult.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    res.json(queryResult[0]);
  } catch (error) {
    console.error('Erro ao obter usuário: ', error);
    res.status(500).json({ error: 'Erro ao processar a solicitação' });
  }
});

app.put('/usuario/editaperfil', async (req, res) => {
  try {
    if (!connectionPromise) {
      connectionPromise = await createConnection({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: 'postgres',
        database: 'postgres',
        logging: true
      });
    }
    const connection = await connectionPromise;

    const { nome, email, senha, id } = req.body;

    if (!nome || !email || !senha || !id) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    const queryResult = await connection.query(
      'UPDATE beaba.usuario SET nome = $1, senha = $2, email = $3 WHERE id = $4',
      [nome, senha, email, id]
    );

    res.status(200).json({ message: 'Usuário editado com sucesso.'});
  } catch (error) {
    console.error('Erro ao editar usuário: ', error);
    res.status(500).json({ error: 'Erro ao processar a solicitação' });
  }
});

app.put('/usuario/admin', async (req, res) => {
  try {
    if (!connectionPromise) {
      connectionPromise = await createConnection({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: 'postgres',
        database: 'postgres',
        logging: true
      });
    }
    const connection = await connectionPromise;

    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'E-mail não encontrado' });
    }

    const queryResult = await connection.query(
      'UPDATE beaba.usuario SET perfil = $1 WHERE email = $2',
      ['admin', email]
    );

    res.status(200).json({ message: 'Usuário agora é um administrador.'});
  } catch (error) {
    console.error('Erro ao alterar permissão: ', error);
    res.status(500).json({ error: 'Erro ao processar a solicitação' });
  }
});

app.put('/usuario/comum', async (req, res) => {
  try {
    if (!connectionPromise) {
      connectionPromise = await createConnection({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: 'postgres',
        database: 'postgres',
        logging: true
      });
    }
    const connection = await connectionPromise;

    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'E-mail não encontrado.' });
    }

    const queryResult = await connection.query(
      'UPDATE beaba.usuario SET perfil = $1 WHERE email = $2',
      ['user', email]
    );

    res.status(200).json({ message: 'Usuário agora é um usuário comum.'});
  } catch (error) {
    console.error('Erro ao alterar permissão: ', error);
    res.status(500).json({ error: 'Erro ao processar a solicitação.' });
  }
});

app.post('/template/cadastro', async (req, res) => {
  try {
    if (!connectionPromise) {
      connectionPromise = await createConnection({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: 'postgres',
        database: 'postgres',
        logging: true
      });
    }
    const connection = await connectionPromise;

    const { nome, extensao, idUsuario } = req.body;

    if (!nome || !extensao || !idUsuario) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    const queryResult = await connection.query(
      'INSERT INTO beaba.templates (nome, extensao, idUsuario, status, dataCriacao) VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP) RETURNING id',
      [nome, extensao, idUsuario, 'ativo']
    );

    console.log('Query Result:', queryResult);

    const idTemplate = queryResult[0];

    res.status(200).json({ id: idTemplate, message: 'Template cadastrado com sucesso.' });

  } catch (error) {
    console.error('Erro ao cadastrar template: ', error);
    res.status(500).json({ error: 'Erro ao processar a solicitação' });
  }
});

app.post('/template/cadastro/campos', async (req, res) => {
  try {
    if (!connectionPromise) {
      connectionPromise = await createConnection({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: 'postgres',
        database: 'postgres',
        logging: true
      });
    }
    const connection = await connectionPromise;

    const { nome, tipo, idTemplate } = req.body;

    if (!nome || !tipo || !idTemplate) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    const queryResult = await connection.query(
      'INSERT INTO beaba.campos (nome, tipo, idtemplate) VALUES ($1, $2, $3)',
      [nome, tipo, idTemplate]
    );

    res.status(200).json({ message: 'Campo cadastrado com sucesso.' });

  } catch (error) {
    console.error('Erro ao cadastrar campo: ', error);
    res.status(500).json({ error: 'Erro ao processar a solicitação' });
  }
});

app.get('/templates', async (req, res) => {
  try {
    if (!connectionPromise) {
      connectionPromise = await createConnection({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: '880708',
        database: 'postgres',
        logging: true
      });
    }
    const connection = await connectionPromise;

    const queryResult = await connection.query(`
        SELECT
            t.*,
            u.nome as nomeUsuario,
            COALESCE(SUM(c.quantidade_campos), 0) AS total_campos,
            s.nome as nomeSquad
        FROM
            beaba.templates t
        JOIN
            beaba.usuario u ON t.idusuario = u.id
        LEFT JOIN
            (SELECT idtemplate, COUNT(id) AS quantidade_campos FROM beaba.campos GROUP BY idtemplate) c
        ON
            t.id = c.idtemplate
        LEFT JOIN
            beaba.squad s
        ON
            u.idSquad = s.id
        GROUP BY
            t.id, u.nome, s.id
        ORDER BY
            id asc
    `);
    res.json(queryResult);
  } catch (error) {
    console.error('Erro ao obter templates: ', error);
    res.status(500).json({ error: 'Erro ao processar a solicitação' });
  }
});

app.put('/templates/:id', async (req, res) => {
  try {
    if (!connectionPromise) {
      connectionPromise = await createConnection({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: '880708',
        database: 'postgres',
        logging: true
      });
    }
    const templateId = req.params.id;
    const { status } = req.body;

    if (!templateId || !status) {
      return res.status(400).json({ error: 'ID do template e status são obrigatórios.' });
    }

    const connection = await connectionPromise;

    const queryResult = await connection.query(
      'UPDATE beaba.templates SET status = $1 WHERE id = $2',
      [status, templateId]
    );

    res.status(200).json({ message: 'Status do template atualizado com sucesso.' });
  } catch (error) {
    console.error('Erro ao atualizar status do template: ', error);
    res.status(500).json({ error: 'Erro ao processar a solicitação.' });
  }
});

app.get('/templates/ativos', async (req, res) => {
  try {
    if (!connectionPromise) {
      connectionPromise = await createConnection({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: '880708',
        database: 'postgres',
        logging: true
      });
    }
    const connection = await connectionPromise;

    const queryResult = await connection.query(`
    SELECT
        t.*,
        COALESCE(SUM(c.quantidade_campos), 0) AS total_campos,
        s.nome as nomeSquad
    FROM
        beaba.templates t
    LEFT JOIN
        (SELECT idtemplate, COUNT(id) AS quantidade_campos FROM beaba.campos GROUP BY idtemplate) c
    ON
        t.id = c.idtemplate
    LEFT JOIN
        beaba.usuario u
    ON
        t.idUsuario = u.id
    LEFT join
        beaba.squad s 
    on
        u.idSquad = s.id
    WHERE
        t.status = $1
    GROUP BY
        t.id, s.nome
    ORDER BY
        id asc
`, ['ativo']);
    res.json(queryResult);
  } catch (error) {
    console.error('Erro ao obter templates: ', error);
    res.status(500).json({ error: 'Erro ao processar a solicitação' });
  }
});

app.get('/templates/:id/campos', async (req, res) => {
  try {
    const templateId = req.params.id;

    if (!templateId) {
      return res.status(400).json({ error: 'ID do template é obrigatório.' });
    }

    if (!connectionPromise) {
      connectionPromise = await createConnection({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: '880708',
        database: 'postgres',
        logging: true
      });
    }

    const connection = await connectionPromise;

    const queryResult = await connection.query(`
        SELECT * FROM beaba.campos WHERE idtemplate = $1
    `, [templateId]);

    res.json(queryResult);
  } catch (error) {
    console.error('Erro ao obter campos do template: ', error);
    res.status(500).json({ error: 'Erro ao processar a solicitação' });
  }
});

app.get('/squad/usuarios', async (req, res) => {
  try {
    const squadID = req.query.idSquad;
    if(!squadID) {
      return res.status(400).json({ error: 'O id da squad é obrigatório.' });
    }
    if (!connectionPromise) {
      connectionPromise = await createConnection({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: '880708',
        database: 'postgres',
        logging: true
      });
    }
    const connection = await connectionPromise;
    const queryResult = await connection.query(`
        SELECT id, 
            nome,
            email,
            perfil
        FROM 
            beaba.usuario
        WHERE
            idSquad = $1
        ORDER BY id ASC
    `,[squadID]);
    res.json(queryResult);
  } catch (error) {
    console.error('Erro ao obter usuários da squad: ', error);
    res.status(500).json({ error: 'Erro ao processar a solicitação' });
  }
});

app.get('/squads', async (req, res) => {
  try {
    if (!connectionPromise) {
      connectionPromise = await createConnection({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: 'postgres',
        database: 'postgres',
        logging: true
      });
    }
    const connection = await connectionPromise;

    const queryResult = await connection.query(`
      SELECT s.id,
            s.nome,
            COUNT(distinct u.id) as totalmembros,
            COUNT(distinct up.id) AS totaluploads
      FROM
            beaba.squad s
      LEFT JOIN
            beaba.usuario u
      ON
            u.idsquad = s.id
      LEFT JOIN
            beaba.uploads up 
      ON 
            up.idUsuario = u.id
      GROUP BY
            s.id, u.idsquad
      ORDER BY id ASC`
    );

    res.status(200).json(queryResult);
  } catch (error) {
    console.error('Erro ao cadastrar squad: ', error);
    res.status(500).json({ error: 'Erro ao processar a solicitação' });
  }
});

app.post('/adicionar/squad', async (req, res) => {
  try {
    if (!connectionPromise) {
      connectionPromise = await createConnection({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: 'postgres',
        database: 'postgres',
        logging: true
      });
    }
    const connection = await connectionPromise;

    const { nome } = req.body;

    if (!nome) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    const queryResult = await connection.query(
      'INSERT INTO beaba.squad (nome) VALUES ($1)',
      [nome]
    );

    res.status(200).json({ message: 'Squad cadastrada com sucesso.'});
  } catch (error) {
    console.error('Erro ao cadastrar squad: ', error);
    res.status(500).json({ error: 'Erro ao processar a solicitação' });
  }
});

createConnection({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: '880708',
  database: 'postgres',
  logging: true
}).then((createdConnection) => {
  connectionPromise = Promise.resolve(createdConnection);
  app.listen(port, () => {
    console.log(`Server conectado em: http://localhost:${port}`);
  });
}).catch(error => console.log('TypeORM connection error: ', error));