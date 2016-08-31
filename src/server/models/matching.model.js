'use strict';

import mongoose from 'mongoose';

const Schema = mongoose.Schema;
let matchingSchema = new Schema({
    userId: String,
    language: [{lan1: String, lan2: String, lan3: String}],
    mbti: String,
    education: [{edu1: String, edu2: String, edu3: String}],
    career: [{car1: String, car2: String, car3: String}],
});

matchingSchema.set('toJSON', {
    getters: true,  // bring all elements include virtuals
    virtuals: true,  // To have all virtuals show up in your console.log output
});

export default mongoose.model('matching', matchingSchema);
