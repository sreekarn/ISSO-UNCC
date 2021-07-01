const model = require('../models/connection');
const Rsvp = require('../models/rsvp');
const flash = require('connect-flash');

exports.connections = (req, res, next)=>{
    model.find()
    .then(story=>res.render('./connection/connections', {story}))
    .catch(err=>next(err));    
};

exports.getAllConnections = (req, res,next) => {
    let map= new Map();
    model.find().then(connections => {
        for(let i=0;i<connections.length;i++){
            let events=[];
            let topic=connections[i].EventCategory;
            if(!map.has(topic)){       
                events.push(connections[i]);
                map.set(topic,events);    
            }        
            else{
                let array=map.get(topic);
                array.push(connections[i])
                map.set(topic,array);
            }         
        }
        console.log(map);
        res.render('./connection/connections',{map:map});
    })
    .catch(err => {
        console.log(err);
        next();
    });   
}



// exports.getConnectionDetail = (req, res, next) => {
//     res.render('./connection/connection');
// }

exports.newConnection = (req, res) => {
    res.render('./connection/newConnection');
}




exports.create = (req, res, next)=>{
    let connection = new model(req.body);//create a new story document
    connection.author = req.session.user;
    connection.save()//insert the document to the database
    .then(connection=> {
        req.flash('success', 'connection has been created successfully');
        res.redirect('/connections');
    })
    .catch(err=>{
        if(err.name === 'ValidationError' ) {
        req.flash('error', err.message);
        return res.redirect('/back');
        }
        next(err);
    });
    
};





exports.show = (req, res, next)=>{
    let id = req.params.id;

    model.findById(id).populate('author', 'firstName lastName')




    .then(result => {           
        if (result){ 
            Rsvp.find({ connection:req.params.id,action:'Yes'}).countDocuments().then(count=>{
                res.render('./connection/connection', { story: result,count:count});
            })            
           .catch(err=>{
                res.render('./connection/connection', { story: result,count:0});
           });
        }
        else
            res.redirect('/connections');
    })
    .catch(err => {
        console.log(err);
        next();
    });
}


exports.update = (req, res, next)=>{
    let story = req.body;
    let id = req.params.id;


    model.findByIdAndUpdate(id,story, {useFindAndModify: false, runValidators: true})
    .then(story=>{  
            req.flash('success', 'Updated successfully');  
           return res.redirect('/connections/'+id);    
    })
    .catch(err=> {
        if(err.name === 'ValidationError') {
            req.flash('error', err.message);
            return res.redirect('/back');
        }
        next(err);
    });
        
};



exports.edit = (req, res, next)=>{
    let id = req.params.id;
    model.findById(id)
    .then(story=>{
       
           return res.render('./connection/updateConnection', {story});
     
           
        
    })
    .catch(err=>next(err));
};




exports.delete = (req, res, next)=>{
    let id = req.params.id;
    model.findByIdAndDelete(id, {useFindAndModify: false} )
    .then(story => {
        req.flash('success', 'Deleted successfully'); 
            res.redirect('/connections');
        
    })
    .catch(err=>next(err));      
    
};

exports.getSavedConnections = (req, res,next) => { 
    Promise.all([Rsvp.find({user:req.session.user.id}).populate('connection'), 
            model.find({author:req.session.user})])   

        .then(result => {
                if (result){
                    const [rsvps,connections] = result;  
                    req.flash('success','Successfully Created or updated the RSVP for the event!');  
                    res.render('./connection/savedConnections', { rsvps,connections});
                    console.log(res.locals.successMessages);
                }
            else
                res.redirect('/connections');
        })
        .catch(err => {
            console.log(err);
            next();
    });   
}
