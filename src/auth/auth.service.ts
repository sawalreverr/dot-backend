import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@users/entities/user.entity';
import { UsersService } from '@users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersService,
    private readonly jwt: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.users.getPasswordByEmail(email.toLowerCase());
    if (!user) {
      throw new UnauthorizedException('invalid email or password');
    }

    const compared = await bcrypt.compare(password, user.password);
    if (!compared) {
      throw new UnauthorizedException('invalid email or password');
    }

    delete (user as any).password;
    return user;
  }

  async login(user: User) {
    const payload = { sub: user.id, email: user.email };
    return { access_token: await this.jwt.signAsync(payload) };
  }
}
