from fastapi import FastAPI, UploadFile, File, HTTPException, Path
from fastapi.middleware.cors import CORSMiddleware
from google.cloud import storage
import pandas as pd
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
import logging
import os
from datetime import datetime

app = FastAPI()

client = storage.Client.from_service_account_json(r'C:\Users\gabri\Downloads\projeto-be-a-ba-46a2543ea3cb.json')

bucket_name = 'projeto_be_a_ba'
bucket = client.bucket(bucket_name)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATABASE_URL = "postgresql+psycopg2://postgres:880708@localhost/postgres"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def is_image(filename):
    allowed_extensions = {'png', 'jpg', 'jpeg', 'gif'}
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in allowed_extensions

def converter_para_numero(valor):
    try:
        int(valor)
        return 'int64'
    except ValueError:
        try:
            float(valor)
            return 'float64'
        except ValueError:
            return 'object'

def verifica_data_csv(data):
    formatos = ["%d/%m/%Y", "%d/%m/%y"]  # Adicione mais formatos se necessário

    for data_formato in formatos:
        try:
            datetime.strptime(data, data_formato)
            return True
        except ValueError:
            pass

    return False

def verificar_arquivo(file_path, template_id):
    extensao = file_path.split('.')[-1].lower()

    if extensao == 'xls':
        df = pd.read_excel(file_path, engine='xlrd')
    elif extensao == 'xlsx':
        df = pd.read_excel(file_path, engine='openpyxl')
    elif extensao == 'csv':
        df = pd.read_csv(file_path)
    else:
        return False

    db = SessionLocal()

    try:
        extensao_esperada = db.execute(text("SELECT extensao FROM beaba.templates WHERE id = :template_id"), {"template_id": template_id}).fetchone()[0]

        campos = db.execute(text("SELECT nome, tipo FROM beaba.campos WHERE idtemplate = :template_id"), {"template_id": template_id}).fetchall()
        campos_dict = dict(campos)

        for coluna in df.columns:
            
            if coluna not in campos_dict:
                raise HTTPException(status_code=400, detail=f"A coluna não está presente na tabela Campos")

            tipo_esperado = campos_dict[coluna]
            extensao_real = extensao

            for indice, valor in df[coluna].items():
                
                tipo_real = type(valor).__name__

                if tipo_real == 'str':
                    tipo_real = 'object'
                elif tipo_real == 'int':
                    tipo_real = 'int64'
                elif tipo_real == 'float':
                    tipo_real = 'float64'

                if extensao_real == 'xls' and tipo_esperado == 'datetime64':
                    tipo_esperado = 'Timestamp'
                elif extensao_real == 'xlsx' and tipo_real == 'datetime':
                    tipo_real = 'Timestamp'
                elif extensao_real == 'xls' and tipo_real == 'datetime':
                    tipo_real = 'Timestamp'

                if extensao_real == 'xls':
                    if valor == 'TRUE' or valor == 'True' or valor == 'true':
                        tipo_real = 'bool'
                    elif valor == 'FALSE' or valor == 'False' or valor == 'false':
                        tipo_real = 'bool'
                elif extensao_real == 'xlsx':
                    if valor == 'TRUE' or valor == 'True' or valor == 'true':
                        tipo_real = 'bool'
                    elif valor == 'FALSE' or valor == 'False' or valor == 'false':
                        tipo_real = 'bool'

                if extensao_real == 'csv' and tipo_esperado == 'object':
                    if converter_para_numero(valor) == 'int64':
                        tipo_real = 'int64'
                    elif converter_para_numero(valor) == 'float64':
                        tipo_real = 'float64'
                    elif verifica_data_csv(valor) == True:
                        tipo_real = 'Timestamp'
                    elif valor == 'TRUE' or valor == 'True' or valor == 'true':
                        tipo_real = 'bool'
                    elif valor == 'FALSE' or valor == 'False' or valor == 'false':
                        tipo_real = 'bool'

                if extensao_real == 'csv' and tipo_esperado == 'int64':
                    if valor == 'TRUE' or valor == 'True' or valor == 'true':
                        tipo_real = 'bool'
                    elif valor == 'FALSE' or valor == 'False' or valor == 'false':
                        tipo_real = 'bool'

                if extensao_real == 'csv' and tipo_esperado == 'float64':
                    if converter_para_numero(valor) == 'int64':
                        tipo_real = 'int64'
                    elif converter_para_numero(valor) == 'float64':
                        tipo_real = 'float64'
                    elif verifica_data_csv(valor) == True:
                        tipo_real = 'Timestamp'
                    elif valor == 'TRUE' or valor == 'True' or valor == 'true':
                        tipo_real = 'bool'
                    elif valor == 'FALSE' or valor == 'False' or valor == 'false':
                        tipo_real = 'bool'
                    else:
                        tipo_real = 'object'

                if extensao_real == 'csv' and tipo_esperado == 'Timestamp':
                    if converter_para_numero(valor) == 'int64':
                        tipo_real = 'int64'
                    elif converter_para_numero(valor) == 'float64':
                        tipo_real = 'float64'
                    elif verifica_data_csv(valor) == True:
                        tipo_real = 'Timestamp'
                    elif valor == 'TRUE' or valor == 'True' or valor == 'true':
                        tipo_real = 'bool'
                    elif valor == 'FALSE' or valor == 'False' or valor == 'false':
                        tipo_real = 'bool'
                    else:
                        tipo_real = 'object'

                if extensao_real == 'csv' and tipo_esperado == 'bool':
                    if valor == 'TRUE' or valor == 'True' or valor == 'true' or valor == 1:
                        tipo_real = 'bool'
                    elif valor == 'FALSE' or valor == 'False' or valor == 'false' or valor == 0:
                        tipo_real = 'bool'
                    elif converter_para_numero(valor) == 'int64':
                        tipo_real = 'int64'
                    elif converter_para_numero(valor) == 'float64':
                        tipo_real = 'float64'
                    elif verifica_data_csv(valor) == True:
                        tipo_real = 'Timestamp'
                    else:
                        tipo_real = 'object'
                
                print(f"Índice: {indice}, Valor: {valor}, Tipo Esperado: {tipo_esperado}, Tipo Real: {tipo_real}")

                if tipo_esperado != tipo_real:
                    if not (tipo_esperado == 'float64' and tipo_real == 'int64'):
                        raise HTTPException(status_code=400, detail=f"O tipo de dados da coluna é diferente do esperado")
                     
                
            if extensao_esperada != extensao_real:
                raise HTTPException(status_code=400, detail=f"O tipo de extensao é diferente do esperado")
    except Exception as e:
        logger.exception(f"Erro durante a verificação do arquivo: {e}")
        return False

    finally:
        db.close()

    return True

def nome_squad(db, usuario_id):
    query = text("SELECT s.nome FROM beaba.squad s JOIN beaba.usuario us ON us.idSquad = s.id WHERE us.id = :usuario_id")
    squad_nome = db.execute(query, {"usuario_id": usuario_id}).fetchone()
    return squad_nome[0] if squad_nome else None

def criar_pasta_squad(bucket, squad_nome):
    pasta_squad = f'arquivos/{squad_nome}/'
    blob = bucket.blob(pasta_squad)

    if not blob.exists():
        blob.upload_from_string('')
        return True
    else:
        return False

def verificar_pasta_squad_existe(bucket, squad_nome):
    pasta_squad = f'arquivos/{squad_nome}/'
    blob = bucket.blob(pasta_squad)

    return blob.exists()

# Configurar o logger
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

@app.post("/upload/{template_id}/{usuario_id}")
async def upload_file(template_id: int, usuario_id: int,file: UploadFile = File(...)):
    db = SessionLocal()
    try:

        script_directory = os.path.dirname(os.path.abspath(__file__))
        uploads_directory = os.path.join(script_directory, 'uploads')
        if not os.path.exists(uploads_directory):
            os.makedirs(uploads_directory)

        file_path = os.path.join(uploads_directory, file.filename)
        with open(file_path, "wb") as temp_file:
            temp_file.write(file.file.read())
        
        file.file.seek(0)

        if not verificar_arquivo(file_path, template_id):
            os.remove(file_path)
            return {'status': 'failure', 'message': 'O arquivo não condiz com o template fornecido!'}
        else:
            nome_da_squad = nome_squad(db, usuario_id)
            if not verificar_pasta_squad_existe(bucket, nome_da_squad):
                criar_pasta_squad(bucket, nome_da_squad)

            objeto_nome = f'arquivos/{nome_da_squad}/{file.filename}'
            blob = bucket.blob(objeto_nome)

            if not blob.exists():
                blob.upload_from_file(file.file)
                os.remove(file_path)

                caminho_completo = f'https://storage.googleapis.com/{bucket_name}/{objeto_nome}'

                query = text("INSERT INTO beaba.uploads (nome, path, dataUpload, idUsuario, idTemplate) VALUES "
                            "(:nome, :path, :data_upload, :id_usuario, :id_template)")

                db.execute(query, {
                    "nome": file.filename,
                    "path": caminho_completo,
                    "data_upload": datetime.utcnow(),
                    "id_usuario": usuario_id,
                    "id_template": template_id
                })

                db.commit()
                
                return {'status': 'success', 'message': 'Arquivo armazenado e verificado com sucesso'}

            else:
                os.remove(file_path)
                return {'status': 'failure', 'message': 'Já existe um arquivo com esse nome!'}      
        
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.exception("Erro interno no servidor")
        raise HTTPException(status_code=500, detail="Erro interno no servidor")
    finally:
        db.close()

@app.get("/uploads")
async def get_uploads():
    db = SessionLocal()
    try:
        query = text("""
            SELECT
                u.id,
                u.nome,
                u.path,
                u.dataupload,
                us.nome as nomeusuario,
                t.extensao,
                t.status,
                s.nome as nomesquad
            FROM
                beaba.uploads u
            JOIN
                beaba.usuario us ON u.idusuario = us.id
            JOIN
                beaba.templates t ON u.idtemplate = t.id
            JOIN
                beaba.squad s
            ON
                us.idSquad = s.id
        """)
        result = db.execute(query).fetchall()

        uploads = [
            {
                "id": row[0],
                "nome": row[1],
                "path": row[2],
                "dataUpload": row[3],
                "nomeUsuario": row[4],
                "extensao": row[5],
                "status": row[6],
                "nomeSquad": row[7]
            }
            for row in result
        ]

        return uploads

    except Exception as e:
        logging.exception("Erro ao recuperar uploads do banco de dados")
        raise HTTPException(status_code=500, detail="Erro interno no servidor")
    finally:
        db.close()

@app.get("/usuario/uploads/{userID}")
async def get_usuario_uploads(userID: int = Path(..., title="ID do Usuário")):
    db = SessionLocal()
    try:
        query = text("""
            SELECT
                u.id,
                u.nome,
                u.path,
                u.dataupload,
                t.extensao,
                t.status
            FROM
                beaba.uploads u
            JOIN
                beaba.usuario us 
            ON 
                u.idusuario = us.id
            JOIN
                beaba.templates t 
            ON 
                u.idtemplate = t.id
            WHERE
                us.id = :userID
        """)
        result = db.execute(query, {"userID": userID}).fetchall()

        uploads = [
            {
                "id": row[0],
                "nome": row[1],
                "path": row[2],
                "dataUpload": row[3],
                "extensao": row[4],
                "status": row[5]
            }
            for row in result
        ]

        return uploads

    except Exception as e:
        logging.exception("Erro ao recuperar uploads do banco de dados")
        raise HTTPException(status_code=500, detail="Erro interno no servidor")
    finally:
        db.close()

@app.post("/upload_foto_perfil/{usuario_id}")
async def upload_foto_perfil(usuario_id: int, file: UploadFile = File(...)):
    if not is_image(file.filename):
        return {'status': 'failure', 'message': 'O arquivo deve ser uma imagem (png, jpg, jpeg, gif)!'}

    objeto_nome = f'fotos/{file.filename}'
    blob = bucket.blob(objeto_nome)

    blob.upload_from_file(file.file)

    caminho_completo = f'https://storage.googleapis.com/{bucket_name}/{objeto_nome}'

    return {'status': 'success', 'message': 'Foto de perfil armazenada com sucesso', 'photo_url': caminho_completo}

@app.put("/usuario/atualiza_foto_perfil")
async def atualiza_foto_perfil(request_data: dict):
    db = SessionLocal()
    try:
        id_usuario = request_data.get("id")
        foto_perfil_url = request_data.get("fotoPerfilUrl")

        query = text("""
            UPDATE beaba.usuario
            SET foto = :foto_perfil_url
            WHERE id = :id_usuario
        """)

        # Imprimir detalhes para depuração
        print(f"{id_usuario} e {foto_perfil_url} Query SQL:", query)

        db.execute(query, {"foto_perfil_url": foto_perfil_url, "id_usuario": id_usuario})
        db.commit()

        return {'status': 'success', 'message': 'URL da foto de perfil atualizada com sucesso'}
    except Exception as e:
        # Imprimir detalhes para depuração
        print(f"Erro ao atualizar a foto de perfil: {e}")
        raise HTTPException(status_code=500, detail='Erro interno no servidor ao atualizar a foto de perfil')