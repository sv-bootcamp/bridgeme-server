'use strict';

import mongoose from 'mongoose';

const Schema = mongoose.Schema;
let careerSchema = new Schema({
    schoolName: String,
    position: String,
    state: String,
    startDate: Number,
    endDate: Number,
});

careerSchema.set('toJSON', {
    getters: true,  // bring all elements include virtuals
    virtuals: true,  // To have all virtuals show up in your console.log output
});

export default mongoose.model('career', careerSchema);
