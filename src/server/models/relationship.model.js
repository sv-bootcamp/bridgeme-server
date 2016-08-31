'use strict';

import mongoose from 'mongoose';

const Schema = mongoose.Schema;
let relationshipSchema = new Schema({
    mentorId: String,
    menteeId: String,
    check: Boolean,
    matchDate: {
        type: Date,
        default: Date.now(),
    },

});

relationshipSchema.set('toJSON', {
    getters: true,  // bring all elements include virtuals
    virtuals: true,  // To have all virtuals show up in your console.log output
});

export default mongoose.model('relationship', relationshipSchema);
