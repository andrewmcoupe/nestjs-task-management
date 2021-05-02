import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { TaskStatus } from './task-status.enum'

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
}
