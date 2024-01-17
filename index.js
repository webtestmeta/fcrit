const bodyParser = require("body-parser");
const path = require("path");
const ejs = require("ejs");
const config = require('./config.json');

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
  res.render('index', {
    title: "Home"
  });
});


app.get('/update/:id', (req, res) => {
  const user = req.params.id;
  res.render('update', {
    title: "Home",
    user : user
  });
});





// Delete route - delete item
app.post('/update', async (req, res) => {
  try {

    const iFilePath = `${req.params.id}`;

    console.log("Deleted User: ", result);
    res.redirect('/admin');
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { message: 'Internal Server Error' });
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