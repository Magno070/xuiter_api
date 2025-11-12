import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Comment extends Document {
  @Prop({ required: true }) authorId: string;
  @Prop({ required: true }) content: string;
  @Prop({ required: true }) postedAt: Date;
  @Prop({ default: 0 }) likes: number;
  @Prop({ default: 0 }) commentsAmmount: number;
  @Prop({ default: 0 }) bombsAmmount: number;
  @Prop({ default: [] }) likedBy: string[];
  @Prop({ default: [] }) bombedBy: string[];
  @Prop({ default: [] }) comments: string[];
  @Prop({ type: String, default: null }) respondingTo: string | null;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
