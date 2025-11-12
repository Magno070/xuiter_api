import { Controller, Get, Post } from '@nestjs/common';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { FeedService } from './feed.service';
import { get } from 'mongoose';

@Controller('feed')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @Get('for-you')
  fetchMyForYouItems(
    @CurrentUser() user: { userId: string; username: string },
  ) {
    return this.feedService.fetchMyForYouItems(user.userId);
  }

  @Get('my-all-xuits')
  fetchAllMyXuits(@CurrentUser() user: { userId: string; username: string }) {
    return this.feedService.fetchAllMyXuits(user.userId);
  }

  @Get('my-posts')
  fetchAllMyPosts(@CurrentUser() user: { userId: string; username: string }) {
    return this.feedService.fetchAllMyPosts(user.userId);
  }

  @Get('my-replies')
  fetchAllMyReplies(@CurrentUser() user: { userId: string; username: string }) {
    return this.feedService.fetchAllMyReplies(user.userId);
  }
}
