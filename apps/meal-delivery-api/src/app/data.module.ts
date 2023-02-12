import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Identity, IdentitySchema } from './auth/identity.schema';
import { MealController } from './meal/meal.controller';
import { Meal, MealSchema } from './meal/meal.schema';
import { MealService } from './meal/meal.service';
import { UserController } from './user/user.controller';
import { User, UserSchema } from './user/user.schema';
import { UserService } from './user/user.service';
import { Product, ProductSchema } from './product/product.schema';
import { ProductController } from './product/product.controller';
import { ProductService } from './product/product.service';
import {
  StudentHouse,
  StudentHouseSchema,
} from './studentHouse/studentHouse.schema';
import { StudentHouseController } from './studentHouse/studentHouse.controller';
import { StudentHouseService } from './studentHouse/studentHouse.service';
import { UserListService } from './userlist/userlist.service';
import { UserListController } from './userlist/userlist.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Identity.name, schema: IdentitySchema },
      { name: User.name, schema: UserSchema },
      { name: Meal.name, schema: MealSchema },
      { name: Product.name, schema: ProductSchema },
      { name: StudentHouse.name, schema: StudentHouseSchema },
    ]),
  ],
  controllers: [
    UserController,
    UserListController,
    MealController,
    ProductController,
    StudentHouseController,
  ],
  providers: [
    UserService,
    UserListService,
    MealService,
    ProductService,
    StudentHouseService,
  ],
})
export class DataModule {}
