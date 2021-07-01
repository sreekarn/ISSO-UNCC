const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const connectionSchema = new Schema({
    author: {type: Schema.Types.ObjectId, ref: 'User'},
    name: {type: String, required: [true, 'name is required']},
    EventCategory: {type: String, required: [true, 'EventCategory is required']},
    HostedBy: {type: String, required: [true, 'HostedBy is required']},
    date: {type: String, required: [true, 'date is required']},
    Details: {type: String, required: [true, 'Details is required'],
                minLength: [10, 'the content should have atleast 10 characters']},
    Location: {type: String, required: [true, 'Location is required']},
    StartTime: {type: String, required: [true, 'StartTime is required']},
    EndTime: {type: String, required: [true, 'EndTime is required']},
    image: {type: String, required: [true, 'image is required']}
    
},
{timestamps: true}
    
);

module.exports = mongoose.model('Connection', connectionSchema);
