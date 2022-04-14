import autocannon from 'autocannon';

autocannon(
  {
    url: 'http://localhost:3000/take',
    method: 'POST',
    body: JSON.stringify({ route: 'GET /home' }),
    headers: {
      'Content-Type': 'application/json',
    },
  },
  console.log
);
