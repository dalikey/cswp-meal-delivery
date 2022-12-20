import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { User as UserModel, UserDocument } from './user.schema';

import { User, UserInfo } from '@md/data';
import { Identity, IdentityDocument } from '../auth/identity.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(Identity.name) private identityModel: Model<IdentityDocument>,
    @InjectModel(UserModel.name) private userModel: Model<UserDocument>
  ) {}

  async getAll(): Promise<UserInfo[]> {
    return this.userModel.find({}, { _id: 0, __v: 0 });
  }

  async getOne(userId: string): Promise<User> {
    const users = await this.userModel.aggregate([
      {
        $match: {
          id: userId,
        },
      },
    ]);

    return users[0];
  }

  async updateUser(userId: string, userInfo: UserInfo): Promise<UserInfo> {
    const user = await this.userModel.findOne({ id: userId });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }

    if (user.username == userInfo.username) {
      throw new HttpException(
        'You are not the owner of this user.',
        HttpStatus.BAD_REQUEST
      );
    }

    if (user) {
      try {
        await this.userModel.updateOne({ id: userId }, [
          {
            $set: {
              id: userId,
              emailAddress: userInfo.emailAddress,
              username: userInfo.username,
              isGraduated: userInfo.isGraduated,
              phoneNumber: userInfo.phoneNumber,
            },
          },
        ]);
      } catch (e) {
        let errorMessage = 'Failed to do something exceptional';
        if (e instanceof Error) {
          errorMessage = e.message;
        }
        throw new HttpException(errorMessage, HttpStatus.BAD_REQUEST);
      }
    } else {
      throw new HttpException('User does not exist', HttpStatus.BAD_REQUEST);
    }

    return userInfo;
  }

  async deleteOne(userId: string) {
    const user = await this.getOne(userId);
    if (user) {
      const userName = user.username;
      await this.identityModel
        .deleteOne({ username: userName })
        .then(() => {
          console.log('Data deleted in identityModel');
        })
        .catch((error) => {
          console.log(error);
        });
      await this.userModel
        .deleteOne({ id: userId })
        .then(() => {
          console.log('Data deleted');
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      throw new HttpException('User does not exist', HttpStatus.BAD_REQUEST);
    }
  }
}
