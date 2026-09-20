# 📄 Gestão de Documentos - Prova Técnica Full Stack

## 🎯 Descrição Resumida do Projeto
Esta aplicação web foi desenvolvida como solução para o desafio técnico da vaga de Estágio em Desenvolvimento Full Stack. Consiste num sistema simples de gestão de documentos que permite aos utilizadores anexar ficheiros (PDF, JPG, PNG), visualizar os documentos submetidos e interagir através de um histórico de comentários com registo preciso de data e hora.

A aplicação foi construída com foco em boas práticas de engenharia de software, incluindo a aplicação de Test-Driven Development (TDD) para regras críticas de negócio e uma arquitetura em camadas.

## 🚀 Acesso à Aplicação (Deploy)
- **Aplicação Web:** [https://document-manager-6lq1.onrender.com](https://document-manager-6lq1.onrender.com)
- **Documentação da API (Swagger):** [https://prova-tecnica-1.onrender.com/api/docs](https://prova-tecnica-1.onrender.com/api/docs)

*(Nota: Como a aplicação está alojada no plano gratuito do Render, o primeiro acesso pode demorar cerca de 50 segundos a responder enquanto o servidor "desperta" da suspensão).*

## 🛠 Tecnologias Utilizadas
**Back-end:**
- Node.js com o framework **NestJS** (TypeScript)
- **TypeORM** para mapeamento objeto-relacional (ORM)
- **PostgreSQL** como base de dados relacional
- **Jest** para testes unitários e aplicação de TDD
- **Swagger** (`@nestjs/swagger`) para documentação interativa da API

**Front-end:**
- HTML5, CSS3 e JavaScript (Vanilla)
- Integração com a API via `fetch` (sem frameworks adicionais, conforme exigência)

**Infraestrutura e Qualidade:**
- **Docker e Docker Compose** (apenas para ambiente local da base de dados)
- **Git** com padrão *Conventional Commits*
- **Oxlint, Prettier e Husky** para garantia de qualidade do código no pré-commit
- **Render** (Cloud Application Hosting) para o deploy

## ⚙️ Instruções para Execução Local

Certifique-se de que tem o [Node.js](https://nodejs.org/) (versão 18+), o [Docker](https://www.docker.com/) (No Windows, instale o **Docker Desktop**) e o [Git](https://git-scm.com/) instalados na sua máquina.

> **Dica para utilizadores Windows:** Recomenda-se a utilização do terminal **Git Bash** ou **PowerShell** para executar os comandos abaixo.

**1. Clonar o repositório:**
```bash
git clone https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git
cd SEU_REPOSITORIO
```

**2. Navegar para a pasta do back-end e instalar as dependências:**
```bash
cd api-backend
npm install
```

**3. Configurar variáveis de ambiente:**
Crie um ficheiro `.env` dentro da pasta `api-backend` e cole o seguinte conteúdo:
```env
DATABASE_URL=postgres://postgres:postgres@localhost:5432/document_db
PORT=3000
TZ=UTC
```

**4. Iniciar a Base de Dados (Docker):**
Para agilizar a avaliação, a base de dados PostgreSQL é levantada via contentor Docker. A partir da raiz do projeto, garanta que o Docker (ou Docker Desktop no Windows) está a correr e execute:
```bash
docker compose up -d
```
*(Nota: dependendo da sua versão do Docker, o comando pode ser `docker-compose up -d` com hífen).*

**5. Executar a Aplicação:**

**Back-end (API):**
Como o TypeORM está configurado para sincronização automática (`synchronize: true`), não é necessário correr migrações manualmente. Basta iniciar o servidor a partir da pasta `api-backend`:
```bash
npm run start:dev
```
A API do servidor (e o Swagger) estará acessível a partir de `http://localhost:3000`.

**Front-end (Interface Visual):**
A interface de utilizador foi construída com HTML puro. Para interagir com a aplicação:
1. Abra a pasta `frontend`.
2. Abra o ficheiro `index.html` diretamente no seu browser (ou utilize uma extensão como o *Live Server* no VS Code).

**6. Executar os Testes Unitários:**
Para validar as regras de negócio via testes unitários, execute o comando abaixo **dentro da pasta `api-backend`**:
```bash
npm run test
```

## 🧠 Decisões de Arquitetura e Boas Práticas
O projeto foi desenvolvido sob os pilares da engenharia de software moderna, garantindo manutenibilidade, segurança e escalabilidade:

- **Test-Driven Development (TDD):** Regras críticas de negócio, como o bloqueio de ficheiros com extensões não permitidas (diferentes de PDF, JPG ou PNG), foram desenvolvidas através do ciclo *Red-Green-Refactor*, assegurando cobertura de testes unitários consistentes.
- **Princípios SOLID e Clean Code:** A arquitetura do back-end utiliza injeção de dependências (nativa do NestJS) para promover um forte isolamento de responsabilidades. A lógica de negócio (*Services*) está totalmente desacoplada da camada de rotas (*Controllers*).
- **Separação de Preocupações (Separation of Concerns):** O Front-end e o Back-end estão totalmente desacoplados em diretórios distintos, comunicando-se exclusivamente via API RESTful.
- **Validação de Dados (DTOs):** Utilização de *Data Transfer Objects* para validar rigorosamente a tipagem e o formato dos dados de entrada (requisições) antes de atingirem o núcleo da aplicação.
- **Qualidade de Código Automatizada (Git Hooks):** Configuração do **Husky** com *lint-staged* para barrar o código no pré-commit caso a formatação (Prettier) ou a análise estática (Oxlint) falhem.
- **Padronização de Histórico:** Adoção estrita do *Conventional Commits* (ex: `feat:`, `fix:`, `docs:`, `test:`) para criar um histórico Git semântico, estruturado e perfeitamente rastreável.
- **Gestão Segura de Configurações:** Credenciais de base de dados e portas são injetadas exclusivamente via variáveis de ambiente (`.env`), garantindo que nenhum dado sensível é comitado no repositório.
- **Tratamento de Fuso Horário:** A variável de ambiente `TZ=UTC` garante que o carimbo de data e hora dos comentários não sofra divergências independentemente da localização geográfica do servidor onde a aplicação é executada.

## ⚠️ Observações Relevantes e Limitações Conhecidas
- **Armazenamento Efémero na Nuvem (Limitação do Deploy):** O requisito funcional exige que o ficheiro seja armazenado localmente no servidor, o que foi estritamente implementado através do pacote Multer (guardando os anexos na pasta `/uploads`). No entanto, devido à limitação do plano gratuito na plataforma *Render*, o disco da máquina virtual é efémero. Isto significa que os ficheiros físicos perdem-se caso a máquina entre em modo de suspensão por inatividade. A persistência em base de dados (metadados e comentários), contudo, mantém-se totalmente operacional. Ao correr o projeto localmente, os ficheiros persistem na pasta normalmente.
- **Paginação:** Caso houvesse um prazo mais alargado, o próximo passo arquitetural seria implementar a paginação na listagem de documentos e de comentários para evitar sobrecarga no front-end em cenários de grande volume de dados. 