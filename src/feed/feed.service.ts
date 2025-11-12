import { Injectable, BadRequestException } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Xuit } from '../xuit/schemas/xuit.schema';
import { Comment } from 'src/comments/comment.schema';

@Injectable()
export class FeedService {
  constructor(
    @InjectModel(Xuit.name) private xuitModel: Model<Xuit>,
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
  ) {}

  async fetchMyForYouItems(userId: string) {
    if (!userId) {
      throw new BadRequestException('userId is required');
    }

    const xuits = await this.xuitModel
      .find({ authorId: { $ne: userId } })
      .sort({ postedAt: -1 })
      .limit(20);

    return xuits;
  }

  async fetchAllMyPosts(userId: string): Promise<Xuit[]> {
    if (!userId) {
      throw new BadRequestException('userId is required');
    }

    const xuits = await this.xuitModel
      .find({ authorId: userId })
      .sort({ postedAt: -1 })
      .limit(10);

    return xuits;
  }

  async fetchAllMyReplies(userId: string): Promise<Comment[]> {
    if (!userId) {
      throw new BadRequestException('userId is required');
    }

    const comments = await this.commentModel
      .find({ authorId: userId })
      .sort({ postedAt: -1 })
      .limit(10);

    return comments;
  }

  async fetchAllMyXuits(userId: string): Promise<(Xuit | Comment)[]> {
    if (!userId) {
      throw new BadRequestException('userId is required');
    }
    const xuits = await this.fetchAllMyPosts(userId);
    const commentsXuits = await this.fetchAllMyReplies(userId);

    return [...xuits, ...commentsXuits];
  }
}
