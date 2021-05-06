import { BadRequestException, PipeTransform } from '@nestjs/common'
import { TaskStatus } from '../task-status.enum'

export class TaskValidationPipe implements PipeTransform {
  readonly allowedStatuses = [
    TaskStatus.OPEN,
    TaskStatus.DONE,
    TaskStatus.IN_PROGRESS,
  ]

  transform(value: string): string {
    value = value.toUpperCase()

    if (!this.isStatusValid(value)) {
      throw new BadRequestException(`${value} is an invalid status`)
    }

    return value
  }

  private isStatusValid(status: any) {
    return this.allowedStatuses.includes(status)
  }
}
