import * as bcrypt from 'bcrypt'
import { User } from './user.entity'

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
}))

describe('UserEntity', () => {
  describe('validatePassword ', () => {
    let user: User

    beforeEach(() => {
      user = new User()
      user.username = 'walterWhite'
      user.password = 'heisenberg'
      user.salt = 'testSalt'
    })

    it('should return true if password is valid', async () => {
      const mockBcryptHash = bcrypt.hash as jest.Mock
      mockBcryptHash.mockResolvedValue('heisenberg')

      const result = await user.validatePassword('testing')

      expect(bcrypt.hash).toHaveBeenCalledWith('testing', 'testSalt')
      expect(result).toEqual(true)
    })

    it('should return false if password is invalid', async () => {
      const mockBcryptHash = bcrypt.hash as jest.Mock
      mockBcryptHash.mockResolvedValue(null)

      const result = await user.validatePassword('testing')

      expect(bcrypt.hash).toHaveBeenCalledWith('testing', 'testSalt')
      expect(result).toEqual(false)
    })
  })
})
