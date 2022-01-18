const cors = require('cors');
const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');

//Import Routes
const authRoute = require('./routes/auth');
const livraisonRoute = require('./routes/livraison');
const chauffeurRoute = require('./routes/chauffeur');


//cors
app.use(cors());
app.options('*', cors());

//get .env variables
dotenv.config()

//limit 10mb
app.use(express.json({ limit: '10mb' }));


// Connect to MongoDB
mongoose.connect(process.env.DB_CONNECT,
    { useNewUrlParser: true, useUnifiedTopology: true },
    ()=>{
        console.log('Connected to MongoDB');
    });


    //Middleware
    app.use(express.json())

    //routes Middleware
    app.use('/api/user', authRoute);
    app.use('/api/livraison', livraisonRoute);
    app.use('/api/chauffeur', chauffeurRoute);


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

