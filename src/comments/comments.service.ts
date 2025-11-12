import { Injectable, BadRequestException } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment } from './comment.schema';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
  ) {}

  async create(
    authorId: string,
    content: string,
    respondingTo: string,
  ): Promise<{ message: string }> {
    if (!authorId || !content || !respondingTo) {
      throw new BadRequestException('Missing required fields');
    }

    const newComment = new this.commentModel({
      authorId,
      content,
      postedAt: new Date(),
      respondingTo,
    });

    await newComment.save();

    return { message: 'Comment created successfully' };
  }

  async getCommentsForXuit(xuitId: string): Promise<Comment[]> {
    if (!xuitId) {
      throw new BadRequestException('xuitId, is required');
    }

    return this.commentModel.find({ xuitId }).exec();
  }

  async deleteCommentsForXuit(xuitId: string): Promise<{ message: string }> {
    if (!xuitId) {
      throw new BadRequestException('xuitId is required');
    }
    await this.commentModel.deleteMany({ xuitId }).exec();
    return { message: 'Comments deleted successfully' };
  }
}
