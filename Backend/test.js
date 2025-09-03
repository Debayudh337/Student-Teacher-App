import express from 'express';

const app = express();
const router = express.Router();

// Test simple route
router.get('/test/:id', (req, res) => {
  res.json({ message: 'Test route works', id: req.params.id });
});

// Test another route
router.get('/user/:userId', (req, res) => {
  res.json({ message: 'User route works', userId: req.params.userId });
});

app.use('/api', router);

app.listen(5001, () => {
  console.log('Test server running on port 5001');
});