
import express from 'express';
import db from '../db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const { departure, destination } = req.query;

  let query = `
    SELECT
      rp.*,
      u.real_name,
      u.gender
    FROM ride_posts rp
    JOIN users u ON rp.user_id = u.user_id
  `;

  const conditions = [];
  const params = [];

  if (departure) {
    conditions.push('rp.departure LIKE ?');
    params.push(`%${departure}%`);
  }

  if (destination) {
    conditions.push('rp.destination LIKE ?');
    params.push(`%${destination}%`);
  }

  if (conditions.length > 0) {
    query += ` WHERE (${conditions.join(' OR ')})`;
  }

  query += ' ORDER BY rp.created_at DESC';

  try {
    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error('모집글 목록 조회 오류:', error);
    res.status(500).json({ message: '모집글 조회 중 서버 오류가 발생했습니다.' });
  }
});

router.get('/user/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const [rows] = await db.query(
      `SELECT
        rp.*,
        u.real_name,
        u.gender
      FROM ride_posts rp
      JOIN users u ON rp.user_id = u.user_id
      WHERE rp.user_id = ?
      ORDER BY rp.created_at DESC`,
      [userId]
    );

    res.json(rows);
  } catch (error) {
    console.error('내 모집글 조회 오류:', error);
    res.status(500).json({ message: '내 모집글 조회 중 서버 오류가 발생했습니다.' });
  }
});

router.get('/:postId', async (req, res) => {
  const { postId } = req.params;

  try {
    const [rows] = await db.query(
      `SELECT
        rp.*,
        u.real_name,
        u.gender,
        u.school
      FROM ride_posts rp
      JOIN users u ON rp.user_id = u.user_id
      WHERE rp.post_id = ?`,
      [postId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: '존재하지 않는 모집글입니다.' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('모집글 상세 조회 오류:', error);
    res.status(500).json({ message: '모집글 조회 중 서버 오류가 발생했습니다.' });
  }
});

router.post('/', async (req, res) => {
  const {
    user_id,
    title,
    description,
    departure,
    destination,
    departure_time,
    max_people,
    estimated_fare
  } = req.body;

  if (!user_id || !title || !departure || !destination || !max_people) {
    return res.status(400).json({ message: '필수 정보를 입력해 주세요.' });
  }

  if (!Number.isInteger(Number(max_people)) || Number(max_people) < 1) {
    return res.status(400).json({ message: '최대 인원은 1명 이상이어야 합니다.' });
  }

  if (departure === destination) {
    return res.status(400).json({ message: '출발지와 목적지는 달라야 합니다.' });
  }

  if (
  estimated_fare !== undefined &&
  estimated_fare !== null &&
  estimated_fare !== '' &&
  (!Number.isInteger(Number(estimated_fare)) || Number(estimated_fare) < 0)
) {
  return res.status(400).json({ message: '예상 비용을 올바르게 입력해 주세요.' });
}

  try {
    const [result] = await db.query(
      `INSERT INTO ride_posts
      (user_id, title, description, departure, destination,
       departure_time, max_people, current_people, estimated_fare)
      VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?)`,
      [
        user_id,
        title,
        description || null,
        departure,
        destination,
        departure_time || null,
        Number(max_people),
        estimated_fare === undefined || estimated_fare === null || estimated_fare === ''
  ? null
  : Number(estimated_fare)
      ]
    );

    res.status(201).json({
      message: '동승 모집글이 등록되었습니다.',
      post_id: result.insertId
    });
  } catch (error) {
    console.error('모집글 등록 오류:', error);
    res.status(500).json({ message: '모집글 등록 중 서버 오류가 발생했습니다.' });
  }
});

router.put('/:postId', async (req, res) => {
  const { postId } = req.params;

  const {
    user_id,
    title,
    description,
    departure,
    destination,
    departure_time,
    max_people,
    estimated_fare
  } = req.body;

  if (!user_id) {
    return res.status(400).json({ message: '작성자 정보가 필요합니다.' });
  }

  try {
    const [posts] = await db.query(
      'SELECT user_id FROM ride_posts WHERE post_id = ?',
      [postId]
    );

    if (posts.length === 0) {
      return res.status(404).json({ message: '모집글을 찾을 수 없습니다.' });
    }

    if (Number(posts[0].user_id) !== Number(user_id)) {
      return res.status(403).json({ message: '작성자만 수정할 수 있습니다.' });
    }

    if (!title || !departure || !destination ||
        !Number.isInteger(Number(max_people)) || Number(max_people) < 1) {
      return res.status(400).json({ message: '필수 정보를 올바르게 입력해 주세요.' });
    }

    if (departure === destination) {
      return res.status(400).json({ message: '출발지와 목적지는 달라야 합니다.' });
    }

    if (
  estimated_fare !== undefined &&
  estimated_fare !== null &&
  estimated_fare !== '' &&
  (!Number.isInteger(Number(estimated_fare)) || Number(estimated_fare) < 0)
) {
  return res.status(400).json({ message: '예상 비용을 올바르게 입력해 주세요.' });
}

    const [currentPosts] = await db.query(
      'SELECT current_people FROM ride_posts WHERE post_id = ?',
      [postId]
    );

    if (Number(max_people) < Number(currentPosts[0].current_people)) {
      return res.status(400).json({ message: '현재 인원보다 최대 인원을 적게 설정할 수 없습니다.' });
    }

    await db.query(
      `UPDATE ride_posts
      SET title = ?, description = ?, departure = ?, destination = ?,
      departure_time = ?, max_people = ?, estimated_fare = ?
      WHERE post_id = ?`,
      [
        title,
        description || null,
        departure,
        destination,
        departure_time || null,
        Number(max_people),
        estimated_fare === undefined || estimated_fare === null || estimated_fare === ''
  ? null
  : Number(estimated_fare),
        postId
      ]
    );

    res.json({ message: '모집글이 수정되었습니다.' });
  } catch (error) {
    console.error('모집글 수정 오류:', error);
    res.status(500).json({ message: '모집글 수정 중 서버 오류가 발생했습니다.' });
  }
});

router.delete('/:postId', async (req, res) => {
  const { postId } = req.params;
  const { user_id } = req.body;

  try {
    const [posts] = await db.query(
      'SELECT user_id FROM ride_posts WHERE post_id = ?',
      [postId]
    );

    if (posts.length === 0) {
      return res.status(404).json({ message: '모집글을 찾을 수 없습니다.' });
    }

    if (Number(posts[0].user_id) !== Number(user_id)) {
      return res.status(403).json({ message: '작성자만 삭제할 수 있습니다.' });
    }

    await db.query(
      'DELETE FROM ride_posts WHERE post_id = ?',
      [postId]
    );

    res.json({ message: '모집글이 삭제되었습니다.' });
  } catch (error) {
    console.error('모집글 삭제 오류:', error);
    res.status(500).json({ message: '모집글 삭제 중 서버 오류가 발생했습니다.' });
  }
});

export default router;
