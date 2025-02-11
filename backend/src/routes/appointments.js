import express from 'express';
import pool from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Criar nova consulta
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { doctorId, datetime } = req.body;
    const patientId = req.user.id;

    // Verificar se o horário está disponível
    const [existingAppointments] = await pool.query(
      'SELECT id FROM appointments WHERE doctor_id = ? AND datetime = ? AND status != "cancelled"',
      [doctorId, datetime]
    );

    if (existingAppointments.length > 0) {
      return res.status(400).json({ message: 'Horário não disponível' });
    }

    // Criar consulta
    const [result] = await pool.query(
      'INSERT INTO appointments (doctor_id, patient_id, datetime) VALUES (?, ?, ?)',
      [doctorId, patientId, datetime]
    );

    res.status(201).json({ 
      id: result.insertId,
      message: 'Consulta agendada com sucesso' 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao agendar consulta' });
  }
});

// Listar consultas do dia (para médicos)
router.get('/today', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'doctor') {
      return res.status(403).json({ message: 'Acesso não autorizado' });
    }

    const [appointments] = await pool.query(
      `SELECT 
        a.*,
        u.name as patient_name,
        u.phone as patient_phone
      FROM appointments a
      INNER JOIN users u ON a.patient_id = u.id
      WHERE a.doctor_id = ? 
      AND DATE(a.datetime) = CURDATE()
      ORDER BY a.datetime ASC`,
      [req.user.id]
    );

    res.json(appointments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar consultas' });
  }
});

// Confirmar consulta (médico)
router.patch('/:id/confirm', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'doctor') {
      return res.status(403).json({ message: 'Acesso não autorizado' });
    }

    const [result] = await pool.query(
      'UPDATE appointments SET status = "confirmed" WHERE id = ? AND doctor_id = ?',
      [req.params.id, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Consulta não encontrada' });
    }

    res.json({ message: 'Consulta confirmada com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao confirmar consulta' });
  }
});

// Cancelar consulta
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const appointment = await pool.query(
      'SELECT * FROM appointments WHERE id = ?',
      [req.params.id]
    );

    if (appointment.length === 0) {
      return res.status(404).json({ message: 'Consulta não encontrada' });
    }

    // Verificar se o usuário tem permissão (paciente ou médico da consulta)
    if (req.user.id !== appointment[0].patient_id && 
        req.user.id !== appointment[0].doctor_id) {
      return res.status(403).json({ message: 'Acesso não autorizado' });
    }

    await pool.query(
      'UPDATE appointments SET status = "cancelled" WHERE id = ?',
      [req.params.id]
    );

    res.json({ message: 'Consulta cancelada com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao cancelar consulta' });
  }
});

// Adicionar avaliação após consulta
router.post('/:id/review', authenticateToken, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const appointmentId = req.params.id;

    // Verificar se a consulta existe e pertence ao paciente
    const [appointments] = await pool.query(
      'SELECT * FROM appointments WHERE id = ? AND patient_id = ? AND status = "completed"',
      [appointmentId, req.user.id]
    );

    if (appointments.length === 0) {
      return res.status(404).json({ 
        message: 'Consulta não encontrada ou não pode ser avaliada ainda' 
      });
    }

    const appointment = appointments[0];

    // Criar avaliação
    await pool.query(
      'INSERT INTO reviews (appointment_id, patient_id, doctor_id, rating, comment) VALUES (?, ?, ?, ?, ?)',
      [appointmentId, req.user.id, appointment.doctor_id, rating, comment]
    );

    // Atualizar média de avaliações do médico
    await updateDoctorRating(appointment.doctor_id);

    res.status(201).json({ message: 'Avaliação registrada com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao registrar avaliação' });
  }
});

// Função auxiliar para atualizar a média de avaliações do médico
async function updateDoctorRating(doctorId) {
  const [ratings] = await pool.query(
    'SELECT AVG(rating) as avg_rating, COUNT(*) as total FROM reviews WHERE doctor_id = ?',
    [doctorId]
  );

  await pool.query(
    'UPDATE doctors SET rating = ?, reviews_count = ? WHERE user_id = ?',
    [ratings[0].avg_rating || 0, ratings[0].total, doctorId]
  );
}

export default router;