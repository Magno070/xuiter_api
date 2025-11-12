import { Module } from '@nestjs/common';
import { FeedController } from './feed.controller';
import { FeedService } from './feed.service';

import { MongooseModule } from '@nestjs/mongoose';
import { Xuit, XuitSchema } from 'src/xuit/schemas/xuit.schema';
import { Comment, CommentSchema } from 'src/comments/comment.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Xuit.name, schema: XuitSchema },
      { name: Comment.name, schema: CommentSchema },
    ]),
  ],
  controllers: [FeedController],
  providers: [FeedService],
})
export class FeedModule {}
