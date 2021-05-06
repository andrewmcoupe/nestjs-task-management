import { Test } from '@nestjs/testing'
import { TasksService } from './tasks.service'
import { TaskRepository } from './task.repository'
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto'
import { TaskStatus } from './task-status.enum'
import { User } from '../auth/user.entity'
import { Task } from './task.entity'
import { NotFoundException } from '@nestjs/common'

const mockUser = { username: 'walterWhite' } as User

const mockTaskRepository = () => ({
  getTasks: jest.fn(),
  findOne: jest.fn(),
})

const mockTasks = [
  {
    userId: 1,
    status: TaskStatus.IN_PROGRESS,
    id: 1,
    title: 'asdasd',
    description: 'asd',
  },
] as Task[]

describe('Tasks service', () => {
  let tasksService: TasksService
  let taskRepository: jest.Mocked<TaskRepository>

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: TaskRepository,
          useFactory: mockTaskRepository,
        },
      ],
    }).compile()

    tasksService = await module.get(TasksService)
    taskRepository = await module.get(TaskRepository)
  })

  describe('getTasks', () => {
    it('should get all tasks from the repository', async () => {
      taskRepository.getTasks.mockResolvedValue(mockTasks)

      expect(taskRepository.getTasks).not.toHaveBeenCalled()

      const stubFilterDto: GetTasksFilterDto = {
        status: TaskStatus.IN_PROGRESS,
        search: '',
      }
      const result = await tasksService.getTasks(stubFilterDto, mockUser)

      expect(taskRepository.getTasks).toHaveBeenCalledWith(
        stubFilterDto,
        mockUser,
      )
      expect(result).toEqual(mockTasks)
    })
  })

  describe('getTaskById', () => {
    it('should get a task by ID from the repository', async () => {
      taskRepository.findOne.mockResolvedValue(mockTasks[0])

      const result = await tasksService.getTaskById(1, mockUser)

      expect(taskRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1, userId: mockUser.id },
      })
      expect(result).toEqual(mockTasks[0])
    })

    it('should throw a not found exception if a task cannot be found', async () => {
      taskRepository.findOne.mockResolvedValue(undefined)

      await expect(tasksService.getTaskById(-1, mockUser)).rejects.toThrow(
        NotFoundException,
      )
    })
  })
})
