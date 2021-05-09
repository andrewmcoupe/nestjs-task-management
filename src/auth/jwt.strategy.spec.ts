import { Test } from '@nestjs/testing'
import { JwtStrategy } from './jwt.strategy'
import { UserRepository } from './user.respository'
import { User } from './user.entity'
import { UnauthorizedException } from '@nestjs/common'

const mockUserRepository = () => ({
  findOne: jest.fn(),
})

const mockUser = { username: 'walterWhite', id: 123 } as User

describe('JWT Strategy', () => {
  let jwtStrategy: JwtStrategy
  let userRepository: jest.Mocked<UserRepository>

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        { provide: UserRepository, useFactory: mockUserRepository },
      ],
    }).compile()

    jwtStrategy = await module.get(JwtStrategy)
    userRepository = await module.get(UserRepository)
  })

  describe('validate', () => {
    it('should return the user', async () => {
      userRepository.findOne.mockResolvedValue(mockUser)

      const result = await jwtStrategy.validate({ username: 'walterWhite' })

      expect(userRepository.findOne).toHaveBeenCalledWith({
        username: 'walterWhite',
      })
      expect(result).toEqual(mockUser)
    })

    it('should throw an unauth exception if user cannot be found', async () => {
      userRepository.findOne.mockResolvedValue(undefined)

      expect(jwtStrategy.validate({ username: 'walterWhite' })).rejects.toThrow(
        UnauthorizedException,
      )
    })
  })
})
