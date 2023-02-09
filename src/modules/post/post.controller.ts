import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Put,
  HttpCode,
} from '@nestjs/common';
import { PostService } from './post.service';
import { GetCurrentUser } from '../../common/decorators/get-user.decorator';
import { IUser } from '../../common/interfaces';
import { HttpResponseHelper } from '../../common/helper/http-response.helper';
import { PaginateDTO } from '../../common/dto/paginate.dto';
import { CreatePostDTO, UpdatePostDTO } from './dto/post.dto';
import { AuthGuard } from '../../common/guards/auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('post')
@UseGuards(AuthGuard)
@ApiBearerAuth()
@ApiTags('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @HttpCode(200)
  async create(
    @Body() createPostDTO: CreatePostDTO,
    @GetCurrentUser() user: IUser,
  ) {
    const response = await this.postService.create(createPostDTO, user);
    return HttpResponseHelper.send('post created', response);
  }

  @Get()
  async findAll(@GetCurrentUser() user: IUser, @Query() query: PaginateDTO) {
    const response = await this.postService.findAll(query, user);
    return HttpResponseHelper.send('posts retrieved', response);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @GetCurrentUser() user: IUser) {
    const response = await this.postService.findOne(id, user);
    return HttpResponseHelper.send('post retrieved', response);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePostDTO: UpdatePostDTO,
    @GetCurrentUser() user: IUser,
  ) {
    await this.postService.update(id, updatePostDTO, user);
    return HttpResponseHelper.send('post updated');
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @GetCurrentUser() user: IUser) {
    await this.postService.remove(id, user);
    return HttpResponseHelper.send('post deleted');
  }
}
