const express = require('express');
const cors = require('cors')

const postsRoutes = require('./routers/postsRoutes');

const server = express();
server.use(cors())

server.use('/api/posts', postsRoutes);

server.listen(8000, () => console.log('API running on port 8000'));