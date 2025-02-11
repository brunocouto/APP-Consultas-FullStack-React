import express from 'express';
import pool from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Listar todos os médicos (com filtros opcionais)
router.get('/', async (req, res) => {
  try {
    const { specialty, search } = req.query;
    let query = `
      SELECT 
        u.id, u.name, u.email, u.phone,
        d.speciality, d.crm, d.rating, d.reviews_count
      FROM users u
      INNER JOIN doctors d ON u.id = d.user_id
      WHERE u.role = 'doctor'
    `;
    
    const params = [];
    if (specialty) {
      query += ' AND d.speciality = ?';
      params.push(specialty);
    }
    if (search) {
      query += ' AND (u.name LIKE ? OR d.speciality LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    const [doctors] = await pool.query(query, params);
    res.json(doctors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar médicos' });
  }
});

// Buscar médico por ID
router.get('/:id', async (req, res) => {
  try {
    const [doctors] = await pool.query(
      `SELECT 
        u.id, u.name, u.email, u.phone,
        d.speciality, d.crm, d.rating, d.reviews_count
      FROM users u
      INNER JOIN doctors d ON u.id = d.user_id
      WHERE u.id = ? AND u.role = 'doctor'`,
      [req.params.id]
    );

    if (doctors.length === 0) {
      return res.status(404).json({ message: 'Médico não encontrado' });
    }

    res.json(doctors[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar médico' });
  }
});

// Buscar horários disponíveis do médico
router.get('/:id/available-slots', async (req, res) => {
  try {
    const { date } = req.query;
    const doctorId = req.params.id;

    // Primeiro, buscar o horário de trabalho do médico para o dia da semana
    const dayOfWeek = new Date(date).getDay();
    const [schedules] = await pool.query(
      'SELECT * FROM doctor_schedules WHERE doctor_id = ? AND day_of_week = ?',
      [doctorId, dayOfWeek]
    );

    // Depois, buscar as consultas já agendadas para o dia
    const [appointments] = await pool.query(
      'SELECT datetime FROM appointments WHERE doctor_id = ? AND DATE(datetime) = ? AND status != "cancelled"',
      [doctorId, date]
    );

    // Gerar slots disponíveis baseado no horário de trabalho e consultas existentes
    const availableSlots = generateAvailableSlots(schedules, appointments, date);

    res.json(availableSlots);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar horários disponíveis' });
  }
});

// Buscar avaliações do médico
router.get('/:id/reviews', async (req, res) => {
  try {
    const [reviews] = await pool.query(
      `SELECT 
        r.*, u.name as patientName
      FROM reviews r
      INNER JOIN users u ON r.patient_id = u.id
      WHERE r.doctor_id = ?
      ORDER BY r.created_at DESC`,
      [req.params.id]
    );

    res.json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar avaliações' });
  }
});

export default router;