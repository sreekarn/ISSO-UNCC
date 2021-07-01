const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');
const connectionRoutes = require('./routes/connectionRoutes');
const userRoutes = require('./routes/userRoutes');
const rsvpRoutes = require('./routes/rsvpRoutes');
const indexRoutes = require('./routes/indexRoutes');
const { MongoClient } = require('mongodb');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');





// create App
const app = express();



//Configure App
let port = 3000;
let host='localhost';
app.set('view engine','ejs');

//connect to database
mongoose.connect('mongodb://localhost:27017/connections', {useNewUrlParser: true, useUnifiedTopology: true })
.then(()=>{
    app.listen(port, host, ()=>{
        console.log('Server is running on port', port);
    });
})
.catch(err=>console.log(err.message));

//Mount Middleware
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(morgan('tiny'));
app.use(methodOverride('_method'));

app.use(session({
    secret: 'sreekar',
    resave : false,
    saveUninitialized : false,
    cookie: {maxAge: 60*60*1000},
    store: new MongoStore({mongoUrl: 'mongodb://localhost:27017/connections'})
}));

app.use(flash());

app.use((req,res,next)=>{
    // console.log(req.session);
    res.locals.user = req.session.user||null;
    res.locals.name = req.session.name||null;
    res.locals.successMessages=req.flash('success');
    res.locals.errorMessages=req.flash('error');
    next();
})


// //Setup Routes

app.use('/', indexRoutes);

app.use('/connections', connectionRoutes);

app.use('/users',userRoutes);

app.use('/rsvp', rsvpRoutes);

app.get('/about',(req,res)=>{
    res.render('about');
})

//contact us page
app.get('/contactus', (req, res) => {      
    res.render('contactus');
});


app.use((req,res,next)=>{
    console.log('404');
    let err = new Error('The server cannot locate '+req.url);
    err.status=404;
    next(err);
});


app.use((err,req,res,next)=>{
    if(!err.status){
        err.status=500;
        err.message = ("Internal Server Error");
    }

    res.status(err.status)
    res.render('error', {error: err});
});

