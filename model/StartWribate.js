const mongoose =require('mongoose')

const StartwribateSchema =new mongoose.Schema({
    wribateTitle:{ type: String, required: true },
    coverImage:{ type: String, required: true },
    forLeadEmail:{type : String ,required:true},
    forSupportingEmails:[{type:String}],
    againstLeadEmail:{type : String ,required:true},
    againstSupportingEmails:[{type:String}],
    judgesEmails:[{type:String}],
    scheduleDateTime:{type:Date,required:true},
    duration:{type:String, required: true },
    category:{type:String, required:true},
    institution:{type:String, required:true},
    scope:{
        type:String,
        enum: ['private','public'],
        required: true
    },
    type:{
        type:String,
        enum: ['private','public'],
        required: true
    },
    prizeAmount:{type:String, required:true},
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model("Startwribate",StartwribateSchema)