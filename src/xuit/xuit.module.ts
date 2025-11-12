import { Module } from '@nestjs/common';

import { XuitController } from './xuit.controller';

import { XuitService } from './xuit.service';
import { UserService } from 'src/user/user.service';
import { CommentsService } from 'src/comments/comments.service';

import { MongooseModule } from '@nestjs/mongoose';
import { Xuit, XuitSchema } from './schemas/xuit.schema';
import { User, UserSchema } from 'src/user/schemas/user.schema';
import { Comment, CommentSchema } from 'src/comments/comment.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Xuit.name, schema: XuitSchema },
      { name: User.name, schema: UserSchema },
      { name: Comment.name, schema: CommentSchema },
    ]),
  ],
  controllers: [XuitController],
  providers: [XuitService, UserService, CommentsService],
  exports: [XuitService],
})
export class XuitModule {}
