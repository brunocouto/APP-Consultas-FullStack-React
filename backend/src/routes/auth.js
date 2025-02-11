import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/database.js';

const router = express.Router();

// Registro de usuário
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, speciality, crm, phone } = req.body;
    
    // Verifica se o email já existe
    const [existingUsers] = await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'Email já cadastrado' });
    }

    // Hash da senha
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Inserir usuário
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, role, phone) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashedPassword, role, phone]
    );

    // Se for médico, adicionar informações específicas
    if (role === 'doctor') {
      await pool.query(
        'INSERT INTO doctors (user_id, speciality, crm) VALUES (?, ?, ?)',
        [result.insertId, speciality, crm]
      );
    }

    res.status(201).json({ message: 'Usuário cadastrado com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao cadastrar usuário' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar usuário
    const [users] = await pool.query(
      'SELECT u.*, d.speciality, d.crm FROM users u LEFT JOIN doctors d ON u.id = d.user_id WHERE u.email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    const user = users[0];

    // Verificar senha
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    // Gerar token JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Remover senha do objeto de resposta
    delete user.password;

    res.json({ token, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao fazer login' });
  }
});

export default router;