import mongoose, { model, Schema } from 'mongoose';
import { TTips } from './tips.interface';

const tipsSchema = new mongoose.Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      require: true,
    },
    content: {
      type: String,
      require: true,
    },
  },
  { timestamps: true },
);

const Tips = model<TTips>('Tips', tipsSchema);
export default Tips;
