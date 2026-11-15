
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import usersRouter from './routes/users.js';
import ridePostsRouter from './routes/ridePosts.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Students Taxi Server is running...');
});

app.use('/api/users', usersRouter);
app.use('/api/ride-posts', ridePostsRouter);

app.listen(PORT, () => {
  console.log(`Students Taxi Server is running on http://localhost:${PORT}`);
});
