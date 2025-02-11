# Backend ConsultasApp

Sistema de backend para agendamento de consultas médicas, desenvolvido com Node.js e MySQL.

## Tecnologias Utilizadas

- **Node.js** - Ambiente de execução JavaScript
- **Express** - Framework web para Node.js
- **MySQL** - Banco de dados relacional
- **JWT** - JSON Web Token para autenticação
- **Bcrypt** - Criptografia de senhas
- **Cors** - Middleware para habilitar CORS
- **Dotenv** - Gerenciamento de variáveis de ambiente

## Pré-requisitos

- Node.js (versão 14 ou superior)
- MySQL (versão 5.7 ou superior)

## Instalação

1. Clone o repositório
```bash
git clone [url-do-repositorio]
cd backend
```

2. Instale as dependências
```bash
npm install
```

3. Configure o banco de dados
- Crie um banco de dados MySQL
- Configure as variáveis de ambiente no arquivo `.env`:
```env
DB_HOST=localhost
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_NAME=consultas_db
JWT_SECRET=sua_chave_secreta_jwt
PORT=3001
```

4. Execute o script SQL
- O arquivo `src/database/schema.sql` contém todas as tabelas necessárias
- Execute este script no seu banco de dados MySQL

5. Inicie o servidor
```bash
npm start
```

## Estrutura do Projeto

```
backend/
├── src/
│   ├── config/         # Configurações (banco de dados, etc)
│   ├── database/       # Scripts SQL
│   ├── middleware/     # Middlewares (autenticação, etc)
│   ├── routes/         # Rotas da API
│   └── server.js       # Arquivo principal do servidor
```

## Rotas da API

### Autenticação

#### POST /api/auth/register
Registra um novo usuário (paciente ou médico)
```json
{
  "name": "Nome Completo",
  "email": "email@exemplo.com",
  "password": "senha123",
  "role": "patient|doctor",
  "phone": "123456789",
  "speciality": "Cardiologia", // apenas para médicos
  "crm": "12345" // apenas para médicos
}
```

#### POST /api/auth/login
Realiza login no sistema
```json
{
  "email": "email@exemplo.com",
  "password": "senha123"
}
```

### Médicos

#### GET /api/doctors
Lista todos os médicos (aceita filtros)
- Query params: 
  - specialty: filtra por especialidade
  - search: busca por nome ou especialidade

#### GET /api/doctors/:id
Busca médico por ID

#### GET /api/doctors/:id/available-slots
Lista horários disponíveis do médico
- Query params:
  - date: data para verificar disponibilidade (YYYY-MM-DD)

#### GET /api/doctors/:id/reviews
Lista avaliações do médico

### Consultas

#### POST /api/appointments
Cria nova consulta (requer autenticação)
```json
{
  "doctorId": "1",
  "datetime": "2024-01-20T10:00:00"
}
```

#### GET /api/appointments/today
Lista consultas do dia (para médicos, requer autenticação)

#### PATCH /api/appointments/:id/confirm
Confirma uma consulta (apenas médicos)

#### DELETE /api/appointments/:id
Cancela uma consulta

#### POST /api/appointments/:id/review
Adiciona avaliação após consulta
```json
{
  "rating": 5,
  "comment": "Ótimo atendimento"
}
```

### Especialidades

#### GET /api/specialties
Lista todas as especialidades

#### GET /api/specialties/:id/doctors
Lista médicos de uma especialidade

#### POST /api/specialties
Adiciona nova especialidade (requer autenticação admin)
```json
{
  "name": "Nova Especialidade"
}
```

### Pacientes

#### GET /api/patients/appointments
Lista consultas do paciente (requer autenticação)

#### GET /api/patients/stats
Busca estatísticas do paciente (requer autenticação)

#### GET /api/patients/history
Busca histórico médico do paciente (requer autenticação)

#### PUT /api/patients/profile
Atualiza perfil do paciente (requer autenticação)
```json
{
  "name": "Novo Nome",
  "phone": "987654321"
}
```

## Autenticação

A API utiliza JWT para autenticação. Para rotas protegidas, inclua o token no header:
```
Authorization: Bearer seu_token_jwt
```

## Erros

A API retorna os seguintes códigos de status:
- 200: Sucesso
- 201: Criado com sucesso
- 400: Erro de validação
- 401: Não autorizado
- 403: Proibido
- 404: Não encontrado
- 500: Erro interno do servidor

## Desenvolvimento

Para rodar em modo desenvolvimento com reload automático:
```bash
npm run dev
```

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request