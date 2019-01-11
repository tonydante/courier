// let mongoose = require('mongoose');
import mongoose from 'mongoose';

// define the schema for our parcel model
let parcelSchema = new mongoose.Schema({
    clientName: { type: String, required: true },
    clientPhone: { type: String, required: true, },
    clientEmail: { type: String, required: true, },
    receiverName: { type: String, required: true, },
    receiverPhone: { type: String, required: true, },
    receiverAddress: { type: String, required: true, },
    trackingNo: { type: String, required: true },
    type: { type: String, required: true,},
    weight: { type: String, required: true, },
    totalFrieght: { type: String, required: true, },
    bookingDate: { type: String, required: true, },
    scheduledDate: { type: String, required: true, },
    fromCity: { type: String, required: true, },
    toCity: { type: String, required: true, },
},
    {
        timestamps: { createdAt: 'created_at' }
    });

// create the model for users and expose it to our app
module.exports = mongoose.model('Parcel', parcelSchema);
