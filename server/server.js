import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Agenda } from 'agenda';
import nodemailer from 'nodemailer';
import path from 'path';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const __dirname = path.resolve();

const agenda = new Agenda({
  db: { address: process.env.MONGODB_URI },
});

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587', 10),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

agenda.define('send email', async (job) => {
  const { to, subject, body } = job.attrs.data;
  try {
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject,
      html: body,
    });
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error(`Failed to send email to ${to}:`, error.message);
  }
});

await agenda.start();

app.post('/api/emails/schedule', async (req, res) => {
  try {
    const { to, subject, body, delay } = req.body;

    console.log(`Scheduling email to ${to} with a delay of ${delay} minutes`);
    await agenda.schedule(`in ${delay} minutes`, 'send email', {
      to,
      subject,
      body,
    });

    res.json({ message: 'Email scheduled successfully' });
  } catch (error) {
    console.error('Error scheduling email:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/flows/save', async (req, res) => {
  try {
    const { nodes, edges, totalDelay } = req.body;

    console.log('Processing flow with total delay:', totalDelay);

    for (const node of nodes) {
      if (node.data.type === 'email' && node.data.config) {
        const { email, subject, body } = node.data.config;

        console.log(`Scheduling email to ${email} with delay ${totalDelay} minutes`);
        await agenda.schedule(`in ${totalDelay} minutes`, 'send email', {
          to: email,
          subject,
          body,
        });
      }
    }

    res.json({ message: 'Flow saved and emails scheduled successfully' });
  } catch (error) {
    console.error('Error saving flow:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.use(express.static(path.join(__dirname, '/frontend/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
