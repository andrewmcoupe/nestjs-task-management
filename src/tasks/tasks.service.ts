import { Injectable, NotFoundException } from '@nestjs/common'
import { TaskStatus } from './task-status.enum'
import { CreateTaskDto } from './dto/create-task.dto'
import { TaskRepository } from './task.repository'
import { InjectRepository } from '@nestjs/typeorm'
import { Task } from './task.entity'
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto'
import { User } from '../auth/user.entity'

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
  ) {}

  async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    return await this.taskRepository.getTasks(filterDto, user)
  }

  async getTaskById(id: number, user: User): Promise<Task | undefined> {
    const task = await this.taskRepository.findOne({
      where: { id, userId: user.id },
    })

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`)
    }

    return task
  }

  async deleteTaskById(id: number, user: User) {
    const result = await this.taskRepository.delete({ id, userId: user.id })

    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID ${id} not found`)
    }
  }

  async updateTaskStatus(
    id: number,
    status: TaskStatus,
    user: User,
  ): Promise<Task | void> {
    const task = await this.getTaskById(id, user)

    if (task) {
      task.status = status
      await task.save()

      return task
    }
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto, user)
  }
}
