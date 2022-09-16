const express = require('express');
const app = express();
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const register = require('./controllers/register')
const signin = require('./controllers/signin')
const profile = require('./controllers/profile')
const image = require('./controllers/image')
const auth = require('./controllers/authorization')
const morgan = require('morgan');
require('dotenv').config();

// //For Heroku
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0; 
// const db = knex({
//   client: 'pg',
//   connection: {
//     connectionString: process.env.DATABASE_URL,
//      ssl: {
//     rejectUnauthorized: false
//     }
//   }
// });

//For Local
const db = knex({
  client: 'pg',
  connection: process.env.POSTGRES_URI
});

app.use(express.json());
// app.use(morgan('combined'));

app.use(cors());

app.get('/', (req, res) => { res.send('success');});

app.post('/signin', signin.signinAuthentication(db, bcrypt));

app.post('/register', register.registerAuthentication(db, bcrypt));

app.get('/profile/:id', auth.requireAuth, (req, res) => { profile.handleProfileGet(req, res, db)});

app.post('/profile/:id', auth.requireAuth, (req, res) => { profile.handleProfileUpdate(req, res, db)});

app.put('/image', auth.requireAuth, (req, res) => { image.handleImage(req, res, db)});

app.post('/imageurl', auth.requireAuth, (req, res) => { image.handleApiCall(req, res)});

app.listen(3001, () => { console.log('Server is running on port: 3001');});
// app.listen(process.env.PORT || 3001, () => { console.log(`Server is running on port: ${process.env.PORT}`);});
