import { NestFactory } from '@nestjs/core'
import { Test } from '@nestjs/testing'
import { UserRepository } from './user.respository'
import { AuthCredentialsDto } from './dto/auth-credentials.dto'
import { ConflictException, InternalServerErrorException } from '@nestjs/common'

const stubCredentialsDto: AuthCredentialsDto = {
  username: 'walterWhite',
  password: 'heisenberg',
}

describe('UserRepository', () => {
  let userRepository: UserRepository

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [UserRepository],
    }).compile()

    userRepository = await module.get<UserRepository>(UserRepository)
  })

  describe('signUp', () => {
    let save: jest.Mock

    beforeEach(() => {
      save = jest.fn()
      userRepository.create = jest.fn().mockReturnValue({ save })
    })

    it('should successfully sign up the user', () => {
      save.mockResolvedValue(undefined)

      expect(userRepository.signUp(stubCredentialsDto)).resolves.not.toThrow()
    })

    it('should throw a conflict exception if duplicate username', async () => {
      save.mockRejectedValue({ code: '23505' })

      await expect(userRepository.signUp(stubCredentialsDto)).rejects.toThrow(
        ConflictException,
      )
    })

    it('should throw an internal server exception saving erros', async () => {
      save.mockRejectedValue(undefined)

      await expect(userRepository.signUp(stubCredentialsDto)).rejects.toThrow(
        InternalServerErrorException,
      )
    })
  })
})
