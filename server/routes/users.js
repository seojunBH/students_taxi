
import express from 'express';
import bcrypt from 'bcrypt';
import db from '../db.js';

const router = express.Router();

router.post('/signup', async (req, res) => {
  const {
    email,
    password,
    real_name,
    gender,
    phone_number,
    school,
    entry_year,
    student_id
  } = req.body;

  if (
    !email || !password || !real_name || !gender ||
    !phone_number || !school || !entry_year || !student_id
  ) {
    return res.status(400).json({ message: '모든 필수 정보를 입력해 주세요.' });
  }

  if (!['MALE', 'FEMALE'].includes(gender)) {
    return res.status(400).json({ message: '올바른 성별을 선택해 주세요.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      `INSERT INTO users
      (email, password, real_name, gender, phone_number, school, entry_year, student_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [email, hashedPassword, real_name, gender, phone_number, school, entry_year, student_id]
    );

    res.status(201).json({
      message: '회원가입이 완료되었습니다.',
      user: {
        user_id: result.insertId,
        email,
        real_name
      }
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        message: '이미 등록된 이메일, 전화번호 또는 학번입니다.'
      });
    }

    console.error('회원가입 오류:', error);
    res.status(500).json({ message: '회원가입 중 서버 오류가 발생했습니다.' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: '이메일과 비밀번호를 입력해 주세요.' });
  }

  try {
    const [rows] = await db.query(
      'SELECT user_id, email, password, real_name, gender,school FROM users WHERE email = ?',
      [email]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: '등록된 회원 정보가 없습니다.' });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: '비밀번호가 일치하지 않습니다.' });
    }

    res.status(200).json({
      message: '로그인 성공',
      user: {
        user_id: user.user_id,
        email: user.email,
        real_name: user.real_name,
        gender: user.gender,
        school : user.school
      }
    });
  } catch (error) {
    console.error('로그인 오류:', error);
    res.status(500).json({ message: '로그인 중 서버 오류가 발생했습니다.' });
  }
});

router.get('/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const [rows] = await db.query(
      `SELECT user_id, email, real_name, gender, phone_number,
      school, entry_year, student_id, created_at, updated_at
      FROM users WHERE user_id = ?`,
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: '회원을 찾을 수 없습니다.' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('회원 조회 오류:', error);
    res.status(500).json({ message: '회원 조회 중 서버 오류가 발생했습니다.' });
  }
});

router.put('/:userId', async (req, res) => {
  const { userId } = req.params;
  const {
    currentPassword,
    email,
    real_name,
    gender,
    phone_number,
    school,
    entry_year,
    student_id
  } = req.body;

  try {
    const [rows] = await db.query(
      'SELECT password FROM users WHERE user_id = ?',
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: '회원을 찾을 수 없습니다.' });
    }

    const isMatch = await bcrypt.compare(currentPassword || '', rows[0].password);

    if (!isMatch) {
      return res.status(401).json({ message: '비밀번호가 일치하지 않습니다.' });
    }
    console.log({
      email,
      real_name,
      gender,
      phone_number,
      school,
      entry_year,
      student_id
    });
    if (!email || !real_name || !gender || !phone_number || !school || !entry_year || !student_id) {
      return res.status(400).json({ message: '모든 회원 정보를 입력해 주세요.' });
    }

    if (!['MALE', 'FEMALE'].includes(gender)) {
      return res.status(400).json({ message: '올바른 성별을 선택해 주세요.' });
    }

    await db.query(
      `UPDATE users
      SET email = ?, real_name = ?, gender = ?, phone_number = ?,
      school = ?, entry_year = ?, student_id = ?
      WHERE user_id = ?`,
      [email, real_name, gender, phone_number, school, entry_year, student_id, userId]
    );

    res.json({ message: '회원 정보가 수정되었습니다.' });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: '이미 사용 중인 이메일, 전화번호 또는 학번입니다.' });
    }

    console.error('회원 수정 오류:', error);
    res.status(500).json({ message: '회원 정보 수정 중 서버 오류가 발생했습니다.' });
  }
});

router.delete('/:userId', async (req, res) => {
  const { userId } = req.params;
  const { password } = req.body;

  try {
    const [rows] = await db.query(
      'SELECT password FROM users WHERE user_id = ?',
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: '회원을 찾을 수 없습니다.' });
    }

    const isMatch = await bcrypt.compare(password || '', rows[0].password);

    if (!isMatch) {
      return res.status(401).json({ message: '비밀번호가 일치하지 않습니다.' });
    }

    await db.query(
      'DELETE FROM users WHERE user_id = ?',
      [userId]
    );

    res.json({ message: '회원 탈퇴가 완료되었습니다.' });
  } catch (error) {
    console.error('회원 탈퇴 오류:', error);
    res.status(500).json({ message: '회원 탈퇴 중 서버 오류가 발생했습니다.' });
  }
});

export default router;
