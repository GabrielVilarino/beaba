from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from google.cloud import storage
import pandas as pd
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
import logging
import os

app = FastAPI()

# Configurar o cliente do Google Cloud Storage
client = storage.Client.from_service_account_json(r'C:\Users\gabri\Downloads\projeto-be-a-ba-46a2543ea3cb.json')

# Especificar o bucket do Google Cloud Storage
bucket_name = 'projeto_be_a_ba'
bucket = client.bucket(bucket_name)

# Configurar o middleware CORS para permitir solicitações do http://localhost:3000
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configurar conexão com o banco de dados
DATABASE_URL = "postgresql+psycopg2://postgres:880708@localhost/postgres"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Função para verificar o arquivo
def verificar_arquivo(file_path, template_id):
    # Detectar o tipo de arquivo
    extensao = file_path.split('.')[-1].lower()

    if extensao == 'xls':
        df = pd.read_excel(file_path, engine='xlrd')
    elif extensao == 'xlsx':
        df = pd.read_excel(file_path, engine='openpyxl')
    elif extensao == 'csv':
        df = pd.read_csv(file_path)
    else:
        return False

    # Iniciar uma sessão do banco de dados
    db = SessionLocal()

    try:
        extensao_esperada = db.execute(text("SELECT extensao FROM beaba.templates WHERE id = :template_id"), {"template_id": template_id}).fetchone()[0]
        # Obter campos associados ao template
        campos = db.execute(text("SELECT nome, tipo FROM beaba.campos WHERE idtemplate = :template_id"), {"template_id": template_id}).fetchall()
        campos_dict = dict(campos)

        # Verificar se os campos no arquivo correspondem aos campos na tabela
        for coluna in df.columns:
            print(f"{coluna}: {df[coluna].unique()}")
            
            if coluna not in campos_dict:   
                raise HTTPException(status_code=400, detail=f"A coluna '{coluna}' não está presente na tabela Campos")

            tipo_esperado = campos_dict[coluna]
            tipo_real = str(df[coluna].dtype)
            extensao_real = extensao
            print(extensao_esperada)
            print(extensao_real)

            # Verificar se o tipo de dados corresponde
            if tipo_esperado != 'float64' and tipo_esperado != tipo_real:
                raise HTTPException(status_code=400, detail=f"O tipo de dados da coluna '{coluna}' é diferente do esperado")
            if extensao_esperada != extensao_real:
                raise HTTPException(status_code=400, detail=f"O tipo de extensao é diferente do esperado")
    except Exception as e:
        # Adicionado log do erro
        logger.exception(f"Erro durante a verificação do arquivo: {e}")
        return False

    finally:
        db.close()

    return True
# Configurar o logger
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)


@app.post("/upload/{template_id}")
async def upload_file(template_id: int, file: UploadFile = File(...)):
    try:

        script_directory = os.path.dirname(os.path.abspath(__file__))
        uploads_directory = os.path.join(script_directory, 'uploads')
        if not os.path.exists(uploads_directory):
            os.makedirs(uploads_directory)

        # Salvar o arquivo temporariamente
        file_path = os.path.join(uploads_directory, file.filename)
        with open(file_path, "wb") as temp_file:
            temp_file.write(file.file.read())
        
        file.file.seek(0)

        if not verificar_arquivo(file_path, template_id):
            # Notificar o front-end sobre a falha na verificação
            os.remove(file_path)
            return {'status': 'failure', 'message': 'O arquivo não condiz com o template fornecido!'}
        else: 
            objeto_nome = f'arquivos/{file.filename}'
            blob = bucket.blob(objeto_nome)
            blob.upload_from_file(file.file)
            os.remove(file_path)
            
            return {'status': 'success', 'message': 'Arquivo armazenado e verificado com sucesso'}               
        
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.exception("Erro interno no servidor")
        raise HTTPException(status_code=500, detail="Erro interno no servidor")
        