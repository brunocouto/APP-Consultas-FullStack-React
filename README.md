# ConsultasApp - Sistema de Agendamento de Consultas Médicas

Sistema completo para agendamento de consultas médicas, com frontend em React e backend em Node.js.

## 📋 Estrutura do Projeto

O projeto está dividido em duas partes principais:

```
/
├── consultas/     # Frontend em React
└── backend/       # API em Node.js
```

Cada pasta contém seu próprio README com instruções específicas.

## 🚀 Tecnologias Utilizadas

### Frontend
- React
- Material-UI
- React Router
- Formik
- Axios
- JWT Decode

### Backend
- Node.js
- Express
- MySQL
- JWT
- Bcrypt

## ⚙️ Pré-requisitos

- Node.js (versão 14 ou superior)
- MySQL (versão 5.7 ou superior)
- NPM ou Yarn

## 🔧 Instalação

1. Clone o repositório
```bash
git clone [url-do-repositorio]
cd ConsultasApp
```

2. Instale as dependências do frontend
```bash
cd consultas
npm install
```

3. Instale as dependências do backend
```bash
cd ../backend
npm install
```

4. Configure o banco de dados e as variáveis de ambiente (veja os READMEs específicos em cada pasta)

## 🏃‍♂️ Rodando o Projeto

### Frontend
```bash
cd consultas
npm run dev
```
O frontend estará disponível em `http://localhost:3000`

### Backend
```bash
cd backend
npm run dev
```
A API estará disponível em `http://localhost:3001`

## 📖 Documentação

- [Documentação do Frontend](./consultas/README.md)
- [Documentação do Backend](./backend/README.md)

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## ✨ Funcionalidades

### Para Pacientes
- Cadastro e login
- Busca de médicos por especialidade
- Agendamento de consultas
- Visualização de histórico médico
- Avaliação de consultas

### Para Médicos
- Gerenciamento de agenda
- Confirmação de consultas
- Visualização de histórico de pacientes
- Perfil profissional com avaliações

## 🔒 Segurança

- Autenticação JWT
- Senhas criptografadas
- Proteção de rotas
- Validação de dados

## 🌐 Endpoints da API

Veja a documentação completa da API no [README do backend](./backend/README.md)