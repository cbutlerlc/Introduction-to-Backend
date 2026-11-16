import express from 'express';
import path from "node:path";
const app = express();

const frontendPath = path.resolve(process.cwd(), "./frontend");

app.use(express.json());
app.use(express.static(frontendPath));

//router import
import userRoutes from './routes/user.route.js';
import postRoutes from './routes/post.route.js';

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/post', postRoutes);

app.get('/hello', (req, res) => {
    res.send(`<h1>Hello Conor!</h1>`);
});

app.get('/about', (req, res) => {
    res.send(`<h1>About This</h1>`);
});

app.get('/student', (req, res) => {
    res.send(`<h1>About This</h1>`);
});

export default app;