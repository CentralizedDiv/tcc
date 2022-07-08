import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersModule } from 'src/users/users.module';
import { rootMongooseTestModule } from 'src/utils/spec-db';
import { AuthService } from '../auth.service';
import { LocalStrategy } from '../guards/local/local.strategy';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [rootMongooseTestModule(), UsersModule],
      providers: [AuthService, LocalStrategy, JwtService],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
