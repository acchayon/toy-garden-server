const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json())


app.get('/', (req, res) => {
    res.send('Kids are playing with toys')
})

app.listen(port, () => {
    console.log(`toys are running on port: ${port}`)
})