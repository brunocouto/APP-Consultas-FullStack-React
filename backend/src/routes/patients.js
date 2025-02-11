import express from 'express';
import pool from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Listar consultas do paciente
router.get('/appointments', authenticateToken, async (req, res) => {
  try {
    const [appointments] = await pool.query(
      `SELECT 
        a.*,
        u.name as doctor_name,
        d.speciality as doctor_speciality
      FROM appointments a
      INNER JOIN users u ON a.doctor_id = u.id
      INNER JOIN doctors d ON u.id = d.user_id
      WHERE a.patient_id = ?
      ORDER BY a.datetime DESC`,
      [req.user.id]
    );

    res.json(appointments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar consultas' });
  }
});

// Buscar estatísticas do paciente
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    // Próxima consulta
    const [nextAppointment] = await pool.query(
      `SELECT 
        a.*,
        u.name as doctor_name,
        d.speciality as doctor_speciality
      FROM appointments a
      INNER JOIN users u ON a.doctor_id = u.id
      INNER JOIN doctors d ON u.id = d.user_id
      WHERE a.patient_id = ?
        AND a.datetime > NOW()
        AND a.status != 'cancelled'
      ORDER BY a.datetime ASC
      LIMIT 1`,
      [req.user.id]
    );

    // Total de consultas
    const [totalAppointments] = await pool.query(
      'SELECT COUNT(*) as total FROM appointments WHERE patient_id = ?',
      [req.user.id]
    );

    // Consultas pendentes
    const [pendingAppointments] = await pool.query(
      `SELECT COUNT(*) as total 
      FROM appointments 
      WHERE patient_id = ? 
        AND status = 'pending'
        AND datetime > NOW()`,
      [req.user.id]
    );

    res.json({
      nextAppointment: nextAppointment[0] || null,
      totalAppointments: totalAppointments[0].total,
      pendingAppointments: pendingAppointments[0].total
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar estatísticas' });
  }
});

// Histórico médico do paciente
router.get('/history', authenticateToken, async (req, res) => {
  try {
    const [appointments] = await pool.query(
      `SELECT 
        a.*,
        u.name as doctor_name,
        d.speciality as doctor_speciality,
        r.rating,
        r.comment
      FROM appointments a
      INNER JOIN users u ON a.doctor_id = u.id
      INNER JOIN doctors d ON u.id = d.user_id
      LEFT JOIN reviews r ON a.id = r.appointment_id
      WHERE a.patient_id = ?
        AND a.status = 'completed'
      ORDER BY a.datetime DESC`,
      [req.user.id]
    );

    res.json(appointments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar histórico médico' });
  }
});

// Atualizar perfil do paciente
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { name, phone } = req.body;

    await pool.query(
      'UPDATE users SET name = ?, phone = ? WHERE id = ?',
      [name, phone, req.user.id]
    );

    res.json({ message: 'Perfil atualizado com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao atualizar perfil' });
  }
});

export default router;