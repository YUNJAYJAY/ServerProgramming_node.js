const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const app = express();
const axios = require('axios');
const baseurl_api = "https://apis.data.go.kr/1051000/recruitment";
const encodedApiKey = "6EpfymZ48STEuIlzDBhHLnuFg%2FdzZg4ghxrBHx5JNToK8G%2FKe3sa%2FfOV18r11cII5%2FTZhj6fZqac0wTg03a94Q%3D%3D"

// 정적 파일을 제공하는 미들웨어 설정
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json())

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'wkwnwodl3#',
  database: 'bridge_job'
});

db.connect(err => {
  if (err) throw err;
  console.log('MySQL Connected...');
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/login.html'));
});
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const query = 'SELECT * FROM users WHERE email = ?';

  db.query(query, [email], (err, results) => {
      if (err) return res.status(500).send(err);
      if (results.length === 0) return res.status(400).send('User not found');

      const user = results[0];
      const isMatch = bcrypt.compareSync(password, user.password);

      if (!isMatch) return res.status(400).send('Invalid credentials');

      const token = jwt.sign({ id: user.id }, 'your_jwt_secret', { expiresIn: '1h' });
      res.json({ token });
  });
});
app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/register.html'));
});
app.post('/register', (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
  db.query(query, [username, email, hashedPassword], (err, result) => {
      if (err) return res.status(500).send(err);
      res.status(201).send('User registered');
  });
});
app.get('/calendar', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/daygrid-views.html'));
});
app.get('/main', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/main.html'));
});
app.get('/main/search', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/search.html'));
});
app.get('/main/mypage', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/mypage.html'));
});


async function getlist() {
  try {
    const url = `${baseurl_api}/list`;
    const headers = {
      'Context-Type': 'application/json',
    };

    const response = await axios.get(url, {
      params: {
        serviceKey: `${encodedApiKey}`,
        pblntInstCd: 'C0860'
      },
      headers: headers
    });
    const responseDiv = document.getElementById('response');
    responseDiv.innerHTML = JSON.stringify(response.data);
    console.log("응답 데이터:", response.data);
  } catch (error) {
    console.error("API 요청 에러:", error.message);
  }
}
getlist();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
