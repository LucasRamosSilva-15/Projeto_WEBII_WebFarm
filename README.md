# 🌱 WebFarm 2.0 — Plataforma Integrada de Gestão Agropecuária

[![Swagger Live](https://img.shields.io/badge/Swagger-Live%20Docs-85EA2D?logo=swagger&logoColor=black)](https://webfarm-backend-x47z.onrender.com/api-docs/)
[![Vercel App](https://img.shields.io/badge/Vercel-Live%20Frontend-000000?logo=vercel&logoColor=white)](https://projeto-webii-web-farm.vercel.app)
[![Render API](https://img.shields.io/badge/Render-Live%20Backend-46E3B7?logo=render&logoColor=white)](https://webfarm-backend-x47z.onrender.com)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.x-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-19.x-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.x-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![SQLite](https://img.shields.io/badge/SQLite-3.x-003B57?logo=sqlite&logoColor=white)](https://www.sqlite.org/)
[![Vitest](https://img.shields.io/badge/Vitest-75%20Passed-FCC72B?logo=vitest&logoColor=black)](https://vitest.dev/)
[![Jest](https://img.shields.io/badge/Jest-84%20Passed-C21325?logo=jest&logoColor=white)](https://jestjs.io/)

O **WebFarm 2.0** é uma solução web full-stack desenvolvida para modernizar, centralizar e simplificar a gestão de propriedades agropecuárias. O sistema consolida pecuária, lavouras, frotas de maquinários, equipe de campo e controle financeiro em uma interface interativa, responsiva e em tempo real.

Projeto desenvolvido para a disciplina de **Desenvolvimento Web II**.

---

## 🌐 Deploy em Produção & Acesso Online

| Serviço | Plataforma | Link Direto | Status |
| :--- | :--- | :--- | :--- |
| **Documentação Swagger UI** | Render | [https://webfarm-backend-x47z.onrender.com/api-docs/](https://webfarm-backend-x47z.onrender.com/api-docs/) | Online 🟢 |
| **Especificação OpenAPI (JSON)** | Render | [https://webfarm-backend-x47z.onrender.com/api-docs.json](https://webfarm-backend-x47z.onrender.com/api-docs.json) | Online 🟢 |
| **Aplicação Web (Frontend)** | Vercel | [https://projeto-webii-web-farm.vercel.app](https://projeto-webii-web-farm.vercel.app) | Online 🟢 |
| **API RESTful (Backend)** | Render | [https://webfarm-backend-x47z.onrender.com](https://webfarm-backend-x47z.onrender.com) | Online 🟢 |

---

## 📐 Diagramas do Sistema

### 1. Arquitetura da Solução & Nuvem

```mermaid
graph TD
    subgraph Cliente["Dispositivos do Usuário"]
        User["Produtor Rural / Administrador"]
    end

    subgraph NuvemVercel["Nuvem Vercel (Global Edge CDN)"]
        Frontend["Frontend SPA: React 19 + Vite 8<br/>TailwindCSS 4 + Lucide Icons<br/>https://projeto-webii-web-farm.vercel.app"]
        SPA_Rewrites["Regras de Roteamento SPA (vercel.json)"]
    end

    subgraph NuvemRender["Nuvem Render (Web Service Container)"]
        Backend["Backend REST API: Node.js 20 + Express 5<br/>https://webfarm-backend-x47z.onrender.com"]
        Swagger["Documentação Interativa Swagger UI<br/>/api-docs/ e /api-docs.json"]
        CorsLayer["Camada de CORS Dinâmica (Vercel + Preflight)"]
        SequelizeORM["Sequelize ORM 6"]
        Database[("SQLite3 Database<br/>database.sqlite")]
    end

    User -->|"Acessa a interface web"| Frontend
    Frontend -->|"Requisições HTTPS / JSON"| CorsLayer
    CorsLayer --> Backend
    Backend --> Swagger
    Backend --> SequelizeORM
    SequelizeORM --> Database
```

---

### 2. Diagrama Entidade-Relacionamento (Modelo de Dados)

```mermaid
erDiagram
    PRODUTOR_RURAL ||--o{ FAZENDA : "possui"
    FAZENDA ||--o{ ANIMAL : "cria"
    ANIMAL ||--o{ VACINACAO : "recebe"
    FAZENDA ||--o{ MAQUINARIO : "opera"
    MAQUINARIO ||--o{ MANUTENCAO : "registra"
    FAZENDA ||--o{ FUNCIONARIO : "emprega"
    FAZENDA ||--o{ PRODUCAO_AGRICOLA : "cultiva"
    FAZENDA ||--o{ TRANSACAO : "movimenta"
    FAZENDA ||--o{ FORNECEDOR : "contrata"
    FAZENDA ||--o{ HISTORICO : "audita"

    PRODUTOR_RURAL {
        int id PK
        string nome
        string cpf_cnpj
        string email
        string senha
        string cell
    }

    FAZENDA {
        int id PK
        int produtor_id FK
        string nome
        string localizacao
        float area_total
        string car
    }

    ANIMAL {
        int id PK
        int fazenda_id FK
        string brinco
        string raca
        float peso_atual
        string status_saude
        date data_nascimento
    }

    VACINACAO {
        int id PK
        int animal_id FK
        string vacina
        date data_aplicacao
        string dose
    }

    MAQUINARIO {
        int id PK
        int fazenda_id FK
        string modelo
        string tipo
        int horimetro
        string status
    }

    MANUTENCAO {
        int id PK
        int maquinario_id FK
        string descricao
        float custo
        date data_manutencao
    }

    FUNCIONARIO {
        int id PK
        int fazenda_id FK
        string nome
        string cargo
        float salario
        string telefone
    }

    PRODUCAO_AGRICOLA {
        int id PK
        int fazenda_id FK
        string talhao
        string cultura
        float area_hectares
        date data_plantio
        date previsao_colheita
    }

    TRANSACAO {
        int id PK
        int fazenda_id FK
        string tipo
        string categoria
        float valor
        date data_transacao
    }

    HISTORICO {
        int id PK
        int fazenda_id FK
        string modulo
        string acao
        string protocolo
        date data_registro
    }
```

---

### 3. Fluxo de Autenticação & Navegação

```mermaid
sequenceDiagram
    autonumber
    actor Produtor as Produtor Rural
    participant App as Frontend (Vercel)
    participant API as API Express (Render)
    participant DB as Banco SQLite (Sequelize)

    Produtor->>App: Acessa /login e preenche credenciais
    App->>API: POST /auth/login { email, senha }
    API->>DB: Busca produtor e fazendas vinculadas
    DB-->>API: Retorna registro autenticado
    API-->>App: Resposta 200 OK + Sessão { id, nome, fazenda, email }
    App->>App: Salva sessão no localStorage ('webfarm_auth_session')
    App-->>Produtor: Redireciona para o Painel Central (/dashboard)
    
    Produtor->>App: Clica em módulo (Animais, Safra, etc.)
    App->>API: GET /animais (com CORS autorizado)
    API->>DB: Consulta dados do rebanho
    DB-->>API: Retorna lista de bovinos
    API-->>App: Resposta JSON
    App-->>Produtor: Renderiza tabela e métricas atualizadas
```

---

### 4. Diagrama de Classes (UML Class Diagram)

```mermaid
classDiagram
    class ProdutorRural {
        +int id
        +string nome
        +string cpf_cnpj
        +string tipo_pessoa
        +string email
        +string senha
        +string cell
        +cadastrar()
        +autenticar()
    }

    class Fazenda {
        +int id
        +int id_produtor
        +string nome
        +string localizacao
        +float area_total
        +string car
        +obterMetricas()
        +atualizarPerfil()
    }

    class Animal {
        +int id
        +int id_fazenda
        +string codigo_brinco
        +string especie
        +string raca
        +string sexo
        +date data_nascimento
        +float peso
        +string status
        +string origem
        +date data_aquisicao
        +registrarPesagem()
        +atualizarSanidade()
    }

    class VacinacaoAnimal {
        +int id
        +int id_animal
        +string vacina
        +date data_aplicacao
        +string dose
        +string lote
        +string responsavel
        +aplicarDose()
    }

    class Maquinario {
        +int id
        +int id_fazenda
        +string nome
        +string tipo
        +string marca
        +string modelo
        +int ano_fabricacao
        +int horimetro
        +string status
        +atualizarHorimetro()
        +agendarRevisao()
    }

    class Veiculo {
        +int id
        +int id_fazenda
        +string placa
        +string modelo
        +string marca
        +int quilometragem
        +string status
        +registrarQuilometragem()
    }

    class Manutencao {
        +int id
        +int id_equipamento
        +int id_veiculo
        +string tipo_manutencao
        +string descricao
        +float custo
        +date data_manutencao
        +registrarOrdemServico()
    }

    class Funcionario {
        +int id
        +int id_fazenda
        +string nome
        +string cargo
        +string cpf
        +float salario
        +date data_admissao
        +string telefone
        +registrarPonto()
        +calcularFolha()
    }

    class ProducaoAgricola {
        +int id
        +int id_fazenda
        +string nome_talhao
        +string cultura
        +float area_hectares
        +date data_plantio
        +date previsao_colheita
        +string status
        +estimarColheita()
        +atualizarStatusSafra()
    }

    class TransacaoFinanceira {
        +int id
        +int id_fazenda
        +string tipo
        +string categoria
        +float valor
        +date data_transacao
        +string descricao
        +string forma_pagamento
        +conciliarCaixa()
    }

    class Fornecedor {
        +int id
        +int id_fazenda
        +string nome
        +string cnpj_cpf
        +string categoria
        +string telefone
        +string email
        +vincularPedido()
    }

    class HistoricoAtividade {
        +int id
        +int id_fazenda
        +string modulo
        +string acao
        +string protocolo
        +date data_registro
        +string usuario
        +gerarTrilhaAuditoria()
    }

    ProdutorRural "1" --> "0..*" Fazenda : gerencia
    Fazenda "1" --> "0..*" Animal : possui
    Animal "1" --> "0..*" VacinacaoAnimal : recebe
    Fazenda "1" --> "0..*" Maquinario : opera
    Fazenda "1" --> "0..*" Veiculo : dispoe
    Maquinario "0..1" --> "0..*" Manutencao : recebe
    Veiculo "0..1" --> "0..*" Manutencao : recebe
    Fazenda "1" --> "0..*" Funcionario : contrata
    Fazenda "1" --> "0..*" ProducaoAgricola : cultiva
    Fazenda "1" --> "0..*" TransacaoFinanceira : movimenta
    Fazenda "1" --> "0..*" Fornecedor : homologa
    Fazenda "1" --> "0..*" HistoricoAtividade : audita
```

---

## 🚀 Funcionalidades e Módulos

### 1. 📊 Painel Central de Operações (Dashboard)
- Indicadores zootécnicos, agronômicos e financeiros consolidados.
- **Gráficos Interativos de Performance:**
  - **Evolução de Peso:** Curva de pesagens e Ganho Médio Diário (GMD) por raça e lote com tooltips dinâmicos e inteligentes.
  - **Fluxo de Caixa Mensal:** Comparativo entre receitas e despesas com identificação de meses superavitários.
  - **Produtividade de Safras:** Volume colhido vs metas por cultura.
- Tabela de atividades recentes com protocolo de auditoria e status.

### 2. 🐂 Pecuária & Gestão de Rebanho
- Cadastro de bovinos com raça, peso atual, data de nascimento, lote e status sanitário.
- Histórico de pesagens periódicas e monitoramento de desempenho.
- Registro e controle de vacinações veterinárias.

### 3. 🚜 Maquinários & Frotas do Campo
- Inventário de tratores, colheitadeiras, implementos e utilitários da fazenda.
- Controle de horímetros e odômetros para manutenção preventiva.
- Registro detalhado de revisões, troca de peças e custos vinculados.

### 4. 👥 Equipe & Colaboradores Rurais
- Gestão de funcionários da propriedade com cargos, salários e contatos.
- Registro de ponto diário, jornadas e histórico de atividades de campo.

### 5. 💰 Gestão Financeira & Fluxo de Caixa
- Lançamento de receitas operacionais (venda de grãos, gado, leite).
- Controle de despesas (combustível, insumos, sementes, folha de pagamento).
- Apuração automática de saldo líquido consolidado.

### 6. 🌾 Safras & Produção Agrícola
- Mapeamento e gestão de talhões e áreas produtivas em hectares.
- Controle por culturas agrícolas (Soja, Milho, Algodão, Café, etc.).
- Acompanhamento do ciclo produtivo: plantio, estimativa de colheita e status da safra.

### 7. 📑 Relatórios Analíticos & Exportação
- Visão tabular avançada com filtros cruzados de período, módulo e categoria.
- Resumos estatísticos automáticos com médias, totais e percentuais.
- Exportação de dados para relatórios gerenciais.

### 8. 🏡 Perfil da Fazenda & Governança
- Modal de perfil institucional da propriedade (nome, CNPJ/CPF, localização, área total, CAR).
- **Central de Ajuda Integrada:** Dúvidas frequentes de navegação e uso.
- **Suporte ao Produtor:** Abertura direta de chamados técnicos e canal oficial.
- **Especialista Agro:** Formulário de consultoria agronômica e zootécnica com acompanhamento técnico.
- **LGPD Agro:** Governança de dados, finalidade de coleta e encarregado de privacidade (DPO).
- **Status de Backup em Nuvem:** Indicador de integridade do banco de dados e disparo de backup manual.

### 9. 🧭 Página 404 Personalizada
- Rota de contingência temática agro (*"Erro 404 • Talhão Não Mapeado"*).
- Exibição da coordenada/rota inválida acessada.
- Atalhos rápidos com acesso direto aos módulos operacionais para rápida recuperação do usuário.

---

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 19** — Interface declarativa em componentes funcionais modernos e reativos.
- **Vite 8** — Empacotador e servidor de desenvolvimento ultra-rápido.
- **Tailwind CSS 4** — Design system com identidade visual agro (#237a32, esmeralda e tons de terra).
- **Lucide React** — Biblioteca de ícones vetoriais leves e consistentes.
- **Vitest & React Testing Library** — Testes unitários e de integração de componentes.

### Backend
- **Node.js 20+** — Ambiente de execução JavaScript assíncrono e escalável.
- **Express 5** — Framework RESTful para rotas, middlewares e validações.
- **Sequelize ORM 6** — Modelagem relacional e abstração de consultas SQL com SQLite.
- **SQLite 3 (v5.1.7)** — Banco de dados relacional leve, portátil e de alta performance.
- **Swagger UI & OpenAPI 3.0** — Documentação interativa em produção e desenvolvimento.
- **CORS** — Middleware dinâmico com suporte nativo para Vercel, Render e localhost.
- **Jest & Supertest** — Bateria completa de testes automatizados de endpoints e regras de negócio.

---

## 📂 Estrutura do Projeto

```text
Projeto_WEBII_WebFarm/
├── backend/
│   ├── src/
│   │   ├── config/          # Banco de dados (Sequelize) e especificação OpenAPI 3.0 (Swagger)
│   │   ├── controllers/     # Regras de negócio de cada módulo
│   │   ├── models/          # Modelos relacionais (Animais, Máquinas, Transações, etc.)
│   │   ├── routes/          # Rotas REST da aplicação
│   │   ├── app.js           # Inicialização e middlewares do Express (CORS, JSON, Docs)
│   │   └── server.js        # Inicialização do servidor HTTP
│   └── database.sqlite      # Arquivo do banco de dados SQLite local
├── frontend/
│   ├── public/              # Ativos estáticos e logotipos oficiais da marca
│   ├── src/
│   │   ├── components/      # Componentes reutilizáveis (Sidebar, Navbar, Modais, Gráficos)
│   │   ├── pages/           # Telas do sistema (Dashboard, Login, Registre, NotFound, etc.)
│   │   ├── services/        # Cliente de API Axios/Fetch configurado com VITE_API_URL
│   │   ├── test/            # Suítes de testes Vitest (Modais, 404, Rotas)
│   │   ├── App.jsx          # Roteamento SPA e gerenciador de sessão
│   │   └── index.css        # Folha de estilo global e tokens do Tailwind
│   ├── package.json
│   ├── vite.config.js
│   └── vercel.json          # Configuração de roteamento SPA na Vercel
├── tests/                   # Bateria de testes Jest de backend (Auth, Animais, CORS, Swagger)
├── render.yaml              # Manifesto de deploy no Render (Web Service Node)
├── vercel.json              # Configuração raiz para deploy da interface na Vercel
├── jest.config.cjs          # Configuração de testes do Jest
└── package.json             # Dependências e scripts do backend e da raiz
```

---

## 💻 Como Executar o Projeto Localmente

### Pré-requisitos
- [Node.js](https://nodejs.org/) versão 18 ou superior instalado.
- [Git](https://git-scm.com/) instalado.

### 1. Clonar o Repositório
```bash
git clone https://github.com/LucasRamosSilva-15/Projeto_WEBII_WebFarm.git
cd Projeto_WEBII_WebFarm
```

### 2. Configurar o Backend
Na raiz do projeto, instale as dependências:
```bash
npm install
```

Crie o arquivo de variáveis de ambiente `.env` na raiz:
```env
PORT=3000
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

Inicie o servidor backend em modo de desenvolvimento:
```bash
npm run dev:backend
```
> O servidor estará rodando em: `http://localhost:3000`  
> A documentação Swagger estará disponível em: `http://localhost:3000/api-docs`

### 3. Configurar o Frontend
Abra um novo terminal e acesse a pasta `frontend`:
```bash
cd frontend
npm install
```

Crie o arquivo `.env` dentro da pasta `frontend`:
```env
VITE_API_URL=http://localhost:3000
```

Inicie o servidor de desenvolvimento do Vite:
```bash
npm run dev
```
> A aplicação estará acessível em: `http://localhost:5173`

---

## 🧪 Executando os Testes Automatizados

O projeto conta com **159 testes automatizados** distribuídos entre frontend e backend:

### Testes do Backend (Jest)
Executam na raiz do projeto e cobrem autenticação, regras de negócio de todos os módulos, documentação Swagger e cabeçalhos CORS:
```bash
npm test
```
*Resultado: 84 testes passando em 12 suítes.*

### Testes do Frontend (Vitest)
Executam na pasta `frontend` e cobrem renderização de componentes, modais interativos, página 404 e roteamento SPA:
```bash
cd frontend
npm test
```
*Resultado: 75 testes passando em 13 suítes.*

---

## 📖 Documentação da API (Swagger / OpenAPI 3.0)

A documentação interativa está disponível tanto em ambiente local quanto em **produção**:

- 🌐 **Swagger UI Online (Produção Render):** [https://webfarm-backend-x47z.onrender.com/api-docs/](https://webfarm-backend-x47z.onrender.com/api-docs/)
- 📋 **OpenAPI JSON Online (Produção Render):** [https://webfarm-backend-x47z.onrender.com/api-docs.json](https://webfarm-backend-x47z.onrender.com/api-docs.json)
- 💻 **Ambiente Local:** `http://localhost:3000/api-docs`

### Principais Endpoints da API

| Método | Endpoint | Descrição |
| :--- | :--- | :--- |
| `POST` | `/auth/login` | Autenticação por e-mail ou CPF/CNPJ |
| `POST` | `/auth/register` | Registro de novos produtores rurais |
| `GET` | `/dashboard/metricas` | Totais consolidados de animais, máquinas, safra e financeiro |
| `GET` / `POST` | `/animais` | Listagem e cadastro de animais do rebanho |
| `GET` / `PUT` / `DELETE`| `/animais/:id` | Consulta, atualização e exclusão de animal |
| `GET` / `POST` | `/maquinarios` | Listagem e cadastro de frotas e tratores |
| `GET` / `POST` | `/funcionarios` | Listagem e admissão de colaboradores |
| `GET` / `POST` | `/producoes` | Listagem e mapeamento de talhões e safras |
| `GET` / `POST` | `/transacoes` | Listagem e registro de receitas e despesas financeiras |
| `GET` / `POST` | `/historico` | Consulta de auditoria de atividades recentes do sistema |
| `GET` / `PUT` | `/fazendas/:id` | Consulta e atualização dos dados cadastrais da fazenda |
| `GET` / `POST` | `/fornecedores` | Gestão de fornecedores e parceiros agropecuários |
| `GET` / `POST` | `/manutencoes` | Ordens de manutenção vinculadas a frotas |
| `GET` / `POST` | `/vacinacoes` | Registro sanitário e vacinas por animal |

---

## 👥 Equipe e Autores

Projeto desenvolvido no âmbito da disciplina de **Desenvolvimento Web II**:

- **Artur Samuel Guedes da Silva**
- **Cauã Amaral de Araújo**
- **Darlan Nóbrega de Oliveira**
- **Jhenyffer Martins da Silva**
- **Lucas Ramos Silva**
- **Maria Alicya Silva Henrique**

---

## 📄 Licença

Este projeto é desenvolvido para fins acadêmicos e educacionais sob a licença **ISC**. Todos os direitos reservados aos respectivos autores.
