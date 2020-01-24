const express = require('express');
const cors = require('cors')
const postsRoutes = require('./routers/postsRoutes');
const server = express();
const port = process.env.PORT || 8000

server.use(cors())

server.use('/api/posts', postsRoutes);

server.listen(port, () => console.log(`API running on port ${port}`));