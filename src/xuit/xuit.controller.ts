import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { XuitService } from './xuit.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { CurrentUser } from '../auth/current-user.decorator';

interface CreateXuitDto {
  content: string;
}

@Controller('xuit')
@UseGuards(JwtAuthGuard)
export class XuitController {
  constructor(private readonly xuitService: XuitService) {}

  @Post('create')
  async create(
    @CurrentUser() user: { userId: string; username: string },
    @Body() createXuitDto: CreateXuitDto,
  ) {
    return this.xuitService.create(user.userId, createXuitDto);
  }

  @Post('like')
  async likeXuit(
    @CurrentUser()
    user: {
      userId: string;
      username: string;
    },
    @Body('xuitId') xuitId: string,
  ) {
    return await this.xuitService.likeXuit(xuitId, user.userId);
  }

  @Post('bomb')
  async bombXuit(
    @CurrentUser()
    user: {
      userId: string;
      username: string;
    },
    @Body('xuitId') xuitId: string,
  ) {
    return await this.xuitService.bombXuit(xuitId, user.userId);
  }

  @Post('comment')
  async commentXuit(
    @CurrentUser()
    user: {
      userId: string;
      username: string;
    },
    @Body('xuitId') xuitId: string,
    @Body('comment') comment: string,
  ) {
    return await this.xuitService.commentXuit(xuitId, user.userId, comment);
  }
}
