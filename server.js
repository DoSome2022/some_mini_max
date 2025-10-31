const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJHcm91cE5hbWUiOiJKb2hubnkgTGVlIiwiVXNlck5hbWUiOiJKb2hubnkgTGVlIiwiQWNjb3VudCI6IiIsIlN1YmplY3RJRCI6IjE5Nzc2MTkzNzg1MDEzMjkyMzYiLCJQaG9uZSI6IiIsIkdyb3VwSUQiOiIxOTc3NjE5Mzc4NDk3MTMwODM2IiwiUGFnZU5hbWUiOiIiLCJNYWlsIjoiam9obm55bGVlY2hldWt5YW5AZ21haWwuY29tIiwiQ3JlYXRlVGltZSI6IjIwMjUtMTAtMzEgMDk6NTI6MDIiLCJUb2tlblR5cGUiOjEsImlzcyI6Im1pbmltYXgifQ.Fqhu2-miIUrzYMHiaTKb6FQY9YLrOT2SO5Z1ys6Y2C33yx6u5gxMYeczMjPz4vzl10P0rPDRYJcw3bqT33OSuke0JrIIrKm5bshigHmMK44lrxH9HbEBM11TYnaIJXN7TjQuh-EPZT6TKki36yqTyBMQhYFJ16-KlcLFuXv3eB8u88qUZdsD3QYR8VFEynHIuKkxEywmnaSjjJejz60lMy6ETsR26BJ9duGolY7Soxg3AEJO8kqMnpPhEmSMXiCLormZYEek3-t-8FiexOLqXbpz2FdJFig4IlNgkUFK3BpQ6JQA6vN69AP7eY5QDMsrQiLwMLg1CmeNeQBbfrakSg'; // 确保在这里使用安全的方法存储密钥

app.use(cors());
app.use(express.json());

app.post('/video_generation', async (req, res) => {
    try {
        const response = await axios.post('https://api.minimax.io/v1/video_generation', req.body, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            }
        });
        res.json(response.data);
    } catch (error) {
        res.status(error.response.status).send(error.response.data);
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
