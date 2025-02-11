import express from 'express';
import pool from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Listar todas as especialidades
router.get('/', async (req, res) => {
  try {
    const [specialties] = await pool.query('SELECT * FROM specialties ORDER BY name');
    res.json(specialties);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar especialidades' });
  }
});

// Buscar médicos por especialidade
router.get('/:id/doctors', async (req, res) => {
  try {
    const [doctors] = await pool.query(
      `SELECT 
        u.id, u.name, u.email, u.phone,
        d.speciality, d.crm, d.rating, d.reviews_count
      FROM users u
      INNER JOIN doctors d ON u.id = d.user_id
      INNER JOIN specialties s ON d.speciality = s.name
      WHERE s.id = ?`,
      [req.params.id]
    );
    res.json(doctors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar médicos da especialidade' });
  }
});

// Adicionar nova especialidade (apenas admin)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name } = req.body;

    // Verificar se já existe
    const [existing] = await pool.query(
      'SELECT * FROM specialties WHERE name = ?',
      [name]
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: 'Especialidade já existe' });
    }

    await pool.query(
      'INSERT INTO specialties (name) VALUES (?)',
      [name]
    );

    res.status(201).json({ message: 'Especialidade adicionada com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao adicionar especialidade' });
  }
});

export default router;