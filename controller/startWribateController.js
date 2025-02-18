const Startwribate =require('../model/StartWribate');
const { uploadFile } = require('../utils/fileHandler');
const mongoose =require('mongoose')


// Ensure emails are always an array
const parseEmails = (emails) => {
    if (!emails) return [];
    if (Array.isArray(emails)) return emails; // Already a valid array
    if (typeof emails === 'string') {
        // Remove brackets and split by comma
        return emails.replace(/[\[\]]/g, '').split(',').map(email => email.trim());
    }
    return []; // Return an empty array if format is unknown
};



const createWribate =async(req,res)=>{
    try {
        const {
            wribateTitle,
            forLeadEmail,
            forSupportingEmails,
            againstLeadEmail,
            againstSupportingEmails,
            judgesEmails,
            scheduleDateTime,
            duration,
            category,
            institution,
            scope,
            type,
            prizeAmount
        } = req.body;

        if (!wribateTitle || !forLeadEmail || !againstLeadEmail || !scheduleDateTime || !duration || !category || !institution || !scope || !type || !prizeAmount) {
            return res.status(400).json({ error: 'All Feilds are Required' });
        }

        const formatedforSupportingEmails = parseEmails(req.body.forSupportingEmails);
        const formatedagainstSupportingEmails = parseEmails(req.body.againstSupportingEmails);
        const formatedjudgesEmails = parseEmails(req.body.judgesEmails);

        // Validate emails
        const allEmails = [
            forLeadEmail,
            againstLeadEmail,
            ...formatedforSupportingEmails,
            ...formatedagainstSupportingEmails,
            ...formatedjudgesEmails
        ];

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!allEmails.every(email => emailRegex.test(email))) {
            return res.status(400).json({ error: 'Invalid email format' });
        }


        let coverImage = null;
        if (req.files && req.files.coverImage) {
            coverImage = await uploadFile(req.files.coverImage, 'wribates');
            if (!coverImage) return res.status(500).json({ error: 'Error uploading image' });
        } else {
            return res.status(400).json({ error: 'Cover image is required' });
        }

        const newWribate = new Startwribate({
            wribateTitle,
            coverImage,
            forLeadEmail,
            forSupportingEmails:formatedforSupportingEmails,
            againstLeadEmail,
            againstSupportingEmails: formatedagainstSupportingEmails,
            judgesEmails: formatedjudgesEmails,
            scheduleDateTime,
            duration,
            category,
            institution,
            scope,
            type,
            prizeAmount,
            createdBy: req.user.userId
        });

        await newWribate.save();
        res.status(201).json({ message: 'Wribate created successfully', wribate: newWribate });

    } catch (error) {
        console.log(error,'error in start wribate');
        res.status(500).json({ error: 'Server error' })
    }
}

const getAllWribate = async(req,res)=>{
    try {
        const wribates = await Startwribate.find();
        res.status(200).json(wribates);
    } catch (error) {
        console.log(error,'error in getAllWribate');
        res.status(500).json({ error: 'Server error' })
    }
} 

const getsingleWribate =async(req,res)=>{
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid Wribate ID' });
        }

        const wribate = await Startwribate.findById(id);
        if (!wribate) {
            return res.status(404).json({ error: 'Wribate not found' });
        }

        res.status(200).json(wribate);

    } catch (error) {
        console.log(error,'error in getSingleWribate');
        res.status(500).json({ error: 'Server error' })
    }
}

const myWribates =async(req,res)=>{
    try {
        const wribates = await Startwribate.find({ createdBy: req.user.userId });
        res.status(200).json(wribates);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
}
module.exports = { createWribate,getAllWribate,getsingleWribate,myWribates }