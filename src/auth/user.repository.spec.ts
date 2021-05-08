import { Test } from '@nestjs/testing'
import * as bcrypt from 'bcrypt'
import { UserRepository } from './user.respository'
import { AuthCredentialsDto } from './dto/auth-credentials.dto'
import { ConflictException, InternalServerErrorException } from '@nestjs/common'
import { User } from './user.entity'

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('testHash'),
}))

const stubCredentialsDto: AuthCredentialsDto = {
  username: 'walterWhite',
  password: 'heisenberg',
}

describe('UserRepository', () => {
  let userRepository: jest.Mocked<UserRepository>

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [UserRepository],
    }).compile()

    userRepository = await module.get(UserRepository)
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

  describe('validateUserPassword', () => {
    let user: User

    beforeEach(() => {
      userRepository.findOne = jest.fn()
      user = new User()
      user.username = 'testUser'
      user.validatePassword = jest.fn()
    })

    it('should return the username if validation is successful', async () => {
      const mockValidatePassword = user.validatePassword as jest.Mock
      userRepository.findOne.mockResolvedValue(user)
      mockValidatePassword.mockResolvedValue(true)

      await expect(
        userRepository.validateUserPassword(stubCredentialsDto),
      ).resolves.toEqual('testUser')
    })

    it('should return null if the user cannot be found', async () => {
      const mockValidatePassword = user.validatePassword as jest.Mock
      userRepository.findOne.mockResolvedValue(undefined)

      await expect(
        userRepository.validateUserPassword(stubCredentialsDto),
      ).resolves.toEqual(null)
    })

    it('should return null if password is invalid', async () => {
      const mockValidatePassword = user.validatePassword as jest.Mock
      userRepository.findOne.mockResolvedValue(undefined)
      mockValidatePassword.mockResolvedValue(false)

      await expect(
        userRepository.validateUserPassword(stubCredentialsDto),
      ).resolves.toEqual(null)
    })
  })

  describe('hashPassword', () => {
    it('should call bcrypt hash to generate a hash', async () => {
      const result = await userRepository.hashPassword(
        'testPassword',
        'testSalt',
      )

      expect(bcrypt.hash).toHaveBeenCalledWith('testPassword', 'testSalt')
      expect(result).toEqual('testHash')
    })
  })
})
