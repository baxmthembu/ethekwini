const express = require('express')
const multer = require('multer')
const {Pool, Connection} = require('pg')
const app = express()
const cors = require('cors')
const knex = require('knex')
require('dotenv').config()
const path = require('path')
const {json, urlencoded} = require('express')
const cloudinary = require('cloudinary').v2
const {CloudinaryStorage} = require('multer-storage-cloudinary')
const {check, validationResult} = require('express-validator')
const rateLimit = require('express-rate-limit')
const cookieParser = require('cookie-parser')
const { hash,compare } = require('bcrypt');
const bcrypt = require("bcryptjs");

app.use(urlencoded({extended: false}))
app.use(cors({
  origin: 'http://localhost:3004',
  credentials: true
}))
app.use(function(req,res,next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3004')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers')
  next()
})
app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())

const db =knex({
  client:'pg',
  connection: {
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
  }
})

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'public/images',
    allowed_formats: ['jpg', 'jpeg', 'png']
  }
})

const upload = multer({
  storage: storage
})

cloudinary.config({ 
  cloud_name: 'dp9gjl43m', 
  api_key: '559611397692518', 
  api_secret: 'e8n19zYEck8q3LlU-0XpFXwnJoY' // Click 'View API Keys' above to copy your API secret
});

const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes amount of time to retry again
  max: 10, // Limit each IP to 5 login requests per 10 minutes
  message: 'Too many requests from this IP, please try again after 15 minutes',
  handler: (req, res) => {
    res.status(429).json({
        message: 'Too many requests, please try again later.',
    });
},
});


app.post('/user', [
    check('address').trim().escape(),
    check('description').trim().escape(),
  ], upload.array('images', 10), async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    console.log("Received Data:", req.body);
  
    const { name, address, description } = req.body;
    const images = req.files || [];
  
    try {
      if (!images || images.length === 0) {
        return res.status(400).json({ msg: 'No image selected' });
      }
  
      const imageUrls = images.map(file => file.path);
      //const imageUrls = images.length > 0 ? images.map(file => file.path).join(',') : null;
  
      if (!address ||  !description) {
        return res.status(400).json({ msg: 'Invalid or missing input data' });
      }
  
  
      // Insert the data into property_info, including the fetched name
      await db('ethekwini').insert({
        name,
        address,
        description,
        image_url: imageUrls //.join(','),
      });  
  
      console.log('Sent complaint info successfully');
      console.log({ name,address,description, imageUrls });
      return res.json({ msg: 'Complaint info sent' });
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ msg: 'An error happened' });
    }
  });

  app.post('/register', [
    check('name').isLength({ min: 3 }).trim().escape(),
    check('id_number').isLength({min: 13}).trim().escape(),
    check('password').isLength({ min: 6 }).trim().escape(),
  ], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    const { name, id_number, password } = req.body;
  
    try {
      const existingUser = await db('user_info').where({ id_number }).first();
  
      if (existingUser) {
        return res.status(400).json({ msg: 'Id number address already exists' });
      }
  
      const hashedPassword = await hash(password, 10);
  
      await db('user_info').insert({
        name,
        id_number,
        password: hashedPassword,
      });
  
      console.log('Registration successful');
      return res.json({ msg: 'Registration successful' });
  
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ msg: 'An error occurred' });
    }
  });

  app.post('/worker_register', [
    check('name').isLength({ min: 3 }).trim().escape(),
    check('badge_number').isLength({max: 7}).trim().escape(),
    check('password').isLength({ min: 6 }).trim().escape(),
  ], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    } 
  
    const { name, badge_number, password } = req.body;
  
    try {
      const existingUser = await db('worker_info').where({ badge_number }).first();
  
      if (existingUser) {
        return res.status(400).json({ msg: 'Badge number already exists' });
      }
  
      const hashedPassword = await hash(password, 10);
  
      await db('worker_info').insert({
        name,
        badge_number,
        password: hashedPassword,
      });
  
      console.log('Registration successful');
      return res.json({ msg: 'Registration successful' });
  
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ msg: 'An error occurred' });
    }
  });
  
  app.post('/login', [
    check('id_number').isLength({ min: 13 }).trim().escape(),
    check('password').isLength({ min: 6 }).trim(),
  ], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { id_number, password } = req.body;

    try {
        // Fetch user by ID number
        const user = await db('user_info')
            .select('id_number', 'password')
            .where({ id_number })
            .first();

        if (!user) {
            return res.status(401).json({ msg: 'Invalid Credentials' });
        }

        // Validate password
        const isPasswordValid = await compare(password, user.password);

        if (isPasswordValid) {
            console.log('Login successful');
            return res.status(200).json({ msg: 'Login successful' });
        } else {
            res.status(401).json({ msg: 'Invalid Credentials' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ msg: 'Internal server error' });
    }
});

app.post('/worker_login', [
  //check('badge_number').isLength({ min: 13 }).trim().escape(),
  check('password').isLength({ min: 6 }).trim(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
  }

  const { badge_number, password } = req.body;

  try {
      // Fetch user by ID number
      const user = await db('worker_info')
          .select('badge_number', 'password')
          .where({ badge_number })
          .first();

      if (!user) {
          return res.status(401).json({ msg: 'Invalid Credentials' });
      }

      // Validate password
      const isPasswordValid = await compare(password, user.password);

      if (isPasswordValid) {
          console.log('Login successful');
          return res.status(200).json({ msg: 'Login successful' });
      } else {
          res.status(401).json({ msg: 'Invalid Credentials' });
      }
  } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ msg: 'Internal server error' });
  }
});

app.post('/tweet', async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  } 

  const { badge_number, tweet } = req.body;

  try {
    await db('tweet').insert({
      badge_number,
      text: tweet
    });

    console.log('Text sent');
    return res.json({ msg: 'Text successful' });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ msg: 'An error occurred' });
  }
});

app.get('/tweets', async (req, res) => {
  try {
    const tweets = await db('tweet').select('*').orderBy('id', 'desc'); // newest first
    return res.json(tweets);
  } catch (error) {
    console.error('Error fetching tweets:', error);
    return res.status(500).json({ msg: 'Error fetching tweets' });
  }
});

// Add this route to your backend
app.get('/user/addresses', async (req, res) => {
  try {
    const data = await db.select('id', 'address', 'name', 'description').from('ethekwini');
    res.json(data);
  } catch (error) {
    console.error('Error fetching addresses:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

app.get('/muvo_history', async(req, res) => {
  try{
    const data = await db.select('*').from('muvo_history');
    res.json(data)
  }catch(error){
    console.error('Error fetching data', error);
    res.status(500).json({msg: 'Server error'})
  }
})
  
const port = 3000
app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})
