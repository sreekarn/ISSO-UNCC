const {body} = require('express-validator');
const {validationResult} = require('express-validator');

exports.validateId = (req,res,next)=>{
    let id = req.params.id;
    if(!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Wrong id');
        err.status = 400;
        next(err);
        }
    else {
        return next();
    }
};

exports.validateSignUp = [body('firstName','firstName cannot be empty').notEmpty().trim().escape(),
body('lastName','lastName cannot be empty').notEmpty().trim().escape(),
body('email','Email address must be a valid email address').isEmail().trim().escape().normalizeEmail() ,
body('password','Password must be atleast 8 characters else atmost 64 characters').isLength({min: 8, max: 64})];

exports.validateLogIn = [body('email','Email address must be a valid email address').isEmail().trim().escape().normalizeEmail() ,
body('password','Password must be atleast 8 characters else atmost 64 characters').isLength({min: 8, max: 64})];


exports.validationResult = (req,res,next)=>{
    let errors = validationResult(req);
    if(!errors.isEmpty()){
        errors.array().forEach(error=>{
            req.flash('error',error.msg);
        });
        return res.redirect('back');
    }
    else{
        return next();
    }
};



exports.validateStory = [body('name','Empty title is not permitted').notEmpty().trim().escape().isLength({min: 3}),
body('Details','Please enter atleast 10 characters to describe the connection').isLength({min: 10}).trim().escape(),
body('date','date should be after today').notEmpty().trim().escape().isDate().isAfter(), 
body('EndTime','Endtime cannot be before start time').notEmpty().trim().escape().custom((EndTime, {req}) => EndTime > req.body.StartTime)
];