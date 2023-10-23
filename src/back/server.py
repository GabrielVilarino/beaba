from fastapi import FastAPI, UploadFile, File, HTTPException
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
            tipo_real = str(df[coluna].dtype)
            extensao_real = extensao

            if tipo_esperado != tipo_real:
                if tipo_esperado == 'float64' and tipo_real == 'int64':
                    return True 
                raise HTTPException(status_code=400, detail=f"O tipo de dados da coluna é diferente do esperado")
            if extensao_esperada != extensao_real:
                raise HTTPException(status_code=400, detail=f"O tipo de extensao é diferente do esperado")
    except Exception as e:
        logger.exception(f"Erro durante a verificação do arquivo: {e}")
        return False

    finally:
        db.close()

    return True

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
            objeto_nome = f'arquivos/{file.filename}'
            blob = bucket.blob(objeto_nome)
            blob.upload_from_file(file.file)
            os.remove(file_path)

            caminho_completo = f'https://storage.googleapis.com/{bucket_name}/{objeto_nome}'

            # Adiciona o caminho do arquivo ao banco de dados sem um modelo
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
                u.idusuario,
                u.idtemplate,
                us.nome as nomeusuario,
                t.extensao
            FROM
                beaba.uploads u
            JOIN
                beaba.usuario us ON u.idusuario = us.id
            JOIN
                beaba.templates t ON u.idtemplate = t.id
            JOIN
                beaba.usuario us2 ON t.id = us2.id
        """)
        result = db.execute(query).fetchall()

        uploads = [
            {
                "id": row[0],
                "nome": row[1],
                "path": row[2],
                "dataUpload": row[3],
                "idUsuario": row[4],
                "idTemplate": row[5],
                "nomeUsuario": row[6],
                "extensao": row[7]
            }
            for row in result
        ]

        return uploads

    except Exception as e:
        logging.exception("Erro ao recuperar uploads do banco de dados")
        raise HTTPException(status_code=500, detail="Erro interno no servidor")
    finally:
        db.close()
        
