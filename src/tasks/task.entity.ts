import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { TaskStatus } from './task-status.enum'
import { User } from '../auth/user.entity'

// Represents a table in the database
@Entity()
export class Task extends BaseEntity {
  @PrimaryGeneratedColumn() // auto increments this field when a new row is added
  id: number

  @Column()
  title: string

  @Column()
  description: string

  @Column()
  status: TaskStatus

  @ManyToOne((type) => User, (user) => user.tasks, { eager: false })
  user?: User

  @Column()
  userId: number
}
