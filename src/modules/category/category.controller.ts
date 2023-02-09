import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Put,
  HttpCode,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDTO, UpdateCategoryDTO } from './dto/category.dto';
import { AuthGuard } from '../../common/guards/auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetCurrentUser } from '../../common/decorators/get-user.decorator';
import { IUser } from '../../common/interfaces';
import { PaginateDTO } from '../../common/dto/paginate.dto';
import { HttpResponseHelper } from '../../common/helper/http-response.helper';
import { async } from 'rxjs';

@Controller('category')
@UseGuards(AuthGuard)
@ApiBearerAuth()
@ApiTags('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @HttpCode(200)
  async create(
    @Body() createCategoryDto: CreateCategoryDTO,
    @GetCurrentUser() user: IUser,
  ) {
    const response = await this.categoryService.create(createCategoryDto, user);
    return HttpResponseHelper.send('category created', response);
  }

  @Get()
  async findAll(@GetCurrentUser() user: IUser, @Query() query: PaginateDTO) {
    const response = await this.categoryService.findAll(query, user);
    return HttpResponseHelper.send('categories retrieved', response);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @GetCurrentUser() user: IUser) {
    const response = await this.categoryService.findOne(id, user);
    return HttpResponseHelper.send('category retrieved', response);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDTO,
    @GetCurrentUser() user: IUser,
  ) {
    await this.categoryService.update(id, updateCategoryDto, user);
    return HttpResponseHelper.send('category updated');
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @GetCurrentUser() user: IUser) {
    await this.categoryService.remove(id, user);
    return HttpResponseHelper.send('category deleted');
  }
}
