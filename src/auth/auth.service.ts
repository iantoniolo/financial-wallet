import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserService } from '../users/users.service';
import { RequestLoginDto } from './dto/request-login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(requestLoginDto: RequestLoginDto) {
    const { email, password } = requestLoginDto;

    const user = await this.userService.findByEmail(email);

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      email: user.email,
      sub: user.id,
      isAdmin: user.isAdmin,
    };

    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }
}
