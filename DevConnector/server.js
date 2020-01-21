const express = require('express'); 
const connectDB= require('./config/db');

const app = express(); 
     
//Connect a database
connectDB();
app.get('/', (req, res) => res.send('API running'));

//init middleware
app.use(express.json({extended: false}));
//Define Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Server is on ${PORT}`)

)
