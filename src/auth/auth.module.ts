import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserRepository } from './user.respository'

@Module({
  imports: [TypeOrmModule.forFeature([UserRepository])], // Allows UserRepository to be available for injection
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
