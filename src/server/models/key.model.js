import mongoose from 'mongoose';
const Schema = mongoose.Schema;

let keySchema = new Schema({
  name: String,
  key: String,
});

export default mongoose.model('key', keySchema);
