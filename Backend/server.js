import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './src/config/db.js';
import authRoutes from './src/routes/auth.js';
import taskRoutes from './src/routes/tasks.js';
import adminRoutes from './src/routes/admin.js';


dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());


app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);
app.use('/admin', adminRoutes);

app.get('/', (req, res) => res.status(200).json({ message: 'working' }));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`it running on http://localhost:${PORT}`);
});
