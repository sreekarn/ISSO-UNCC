const Rsvp = require('../models/rsvp');
const Connection = require('../models/connection');
const flash = require('connect-flash');

exports.updateRsvp = (req, res, next) => {  
    let rsvpParams = {
        user:req.session.user.id,
        connection:req.params.id,
        action:req.params.action
    };
    Rsvp.updateOne(
        {connection: req.params.id, user: req.session.user.id},
        { $set: rsvpParams },
        {upsert:true})
        .then(result => {                      
            Promise.all([Rsvp.find({user:req.session.user.id}).populate('connection').populate('user'), 
            Connection.find({author:req.session.user})])           
            .then(result => {
                const [rsvps,connections] = result;            
                if (result){   
                    req.flash('success', 'You have successfully updated RSVP');
                    res.redirect('/users/profile');
                }               
                else
                    res.redirect('/connections');   
                          
                })    
      
        })
        .catch(err => {
            console.log(err);
            next();
        });
             
}

exports.deleteRsvp = (req, res, next) => {  
    Rsvp.findOneAndDelete({connection:req.params.id})
   .then(result=>{
        req.flash('success', 'You have successfully deleted');
        res.redirect('/connections/savedConnections');
        
    })
    .catch(err => {
        console.log(err);
        next();
    });
}

exports.getUpdateRsvp = (req, res, next) => {
    Rsvp.find({connection:req.params.id},{action:'Yes'}).countDocuments()
        .then(count => {      
            res.render('./connection/req.params.id',{count:count});   
            req.flash('success', 'You have successfully Updated!');       
        })
        .catch(err => {
            console.log(err);
            next();
        });
       
}
