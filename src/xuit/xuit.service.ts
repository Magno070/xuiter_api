import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Xuit } from './schemas/xuit.schema';
import { Comment } from 'src/comments/comment.schema';

import { UserService } from 'src/user/user.service';
import { CommentsService } from 'src/comments/comments.service';

interface CreateXuitDto {
  content: string;
}

@Injectable()
export class XuitService {
  constructor(
    @InjectModel(Xuit.name) private xuitModel: Model<Xuit>,
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
    private readonly userService: UserService,
    private readonly commentsService: CommentsService,
  ) {}

  async create(
    userId: string,
    createXuitDto: CreateXuitDto,
  ): Promise<{ message: string }> {
    if (!createXuitDto || Object.keys(createXuitDto).length === 0) {
      throw new BadRequestException('Request body is required');
    }
    if (
      typeof createXuitDto.content !== 'string' ||
      !createXuitDto.content.trim()
    ) {
      throw new BadRequestException('Content is required');
    }

    const newXuit = new this.xuitModel({
      content: createXuitDto.content.trim(),
      postedAt: new Date(),
      authorId: userId,
    });

    await newXuit.save();

    return { message: 'Xuit created successfully' };
  }

  async likeXuit(xuitId: string, userId: string): Promise<{ message: string }> {
    if (!userId) {
      throw new BadRequestException('Request body is required');
    }
    const xuit = await this.xuitModel.findById(xuitId);
    if (!xuit) {
      throw new NotFoundException('Xuit not found');
    }

    if (xuit.likedBy.includes(userId)) {
      xuit.likes -= 1;
      xuit.likedBy = xuit.likedBy.filter((id) => id !== userId);
      await xuit.save();
      return { message: 'Xuit unliked successfully' };
    }

    xuit.likes += 1;
    xuit.likedBy.push(userId);
    await xuit.save();
    return { message: 'Xuit liked successfully' };
  }

  async bombXuit(xuitId: string, userId: string): Promise<{ message: string }> {
    if (!xuitId) {
      throw new BadRequestException('xuitId is required');
    }
    const xuit = await this.xuitModel.findById(xuitId);
    if (!xuit) {
      throw new NotFoundException('Xuit not found');
    }

    if (xuit.bombedBy.includes(userId)) {
      xuit.bombsAmmount -= 1;
      xuit.bombedBy = xuit.bombedBy.filter((id) => id !== userId);
      await xuit.save();
      return { message: 'Xuit unbombed successfully' };
    }

    xuit.bombsAmmount += 1;
    xuit.bombedBy.push(userId);
    await xuit.save();
    return { message: 'Xuit bombed successfully' };
  }

  async commentXuit(
    xuitId: string,
    userId: string,
    comment: string,
  ): Promise<{ message: string }> {
    if (!comment || !comment.trim()) {
      throw new BadRequestException('Comment content is required');
    }
    if (!xuitId) {
      throw new BadRequestException('xuitId is required');
    }

    const xuit = await this.xuitModel.findById(xuitId);
    if (!xuit) {
      throw new NotFoundException('Xuit not found');
    }

    await this.commentsService.create(userId, comment, xuitId);

    await this.xuitModel.updateOne(
      { _id: xuitId },
      {
        $inc: { commentsAmmount: 1 },
      },
    );

    return { message: 'Comment added successfully' };
  }
}
