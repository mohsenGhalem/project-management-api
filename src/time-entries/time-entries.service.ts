import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { TimeEntry } from './entities/time-entry.entity';
import { Task } from '../tasks/entities/task.entity';
import { User } from '../users/entities/user.entity';
import { CreateTimeEntryDto } from './dto/create-time-entry.dto';
import { UpdateTimeEntryDto } from './dto/update-time-entry.dto';

@Injectable()
export class TimeEntriesService {
  constructor(
    @InjectRepository(TimeEntry)
    private readonly timeEntryRepository: Repository<TimeEntry>,
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createTimeEntryDto: CreateTimeEntryDto): Promise<TimeEntry> {
    const { taskId, userId, startTime, endTime, hours, ...timeEntryData } = createTimeEntryDto;

    // Find task
    const task = await this.taskRepository.findOne({ where: { id: taskId } });
    if (!task) {
      throw new NotFoundException(`Task with ID ${taskId} not found`);
    }

    // Find user
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Validate time logic if both start and end times are provided
    if (startTime && endTime) {
      const calculatedHours = this.calculateHours(startTime, endTime);
      if (Math.abs(calculatedHours - hours) > 0.5) {
        throw new BadRequestException(
          `Hours logged (${hours}) don't match the calculated time difference (${calculatedHours})`
        );
      }
    }

    const timeEntry = this.timeEntryRepository.create({
      ...timeEntryData,
      hours,
      startTime,
      endTime,
      task,
      user,
    });

    const savedTimeEntry = await this.timeEntryRepository.save(timeEntry);

    // Update task's logged hours
    await this.updateTaskLoggedHours(taskId);

    return savedTimeEntry;
  }

  async findAll(): Promise<TimeEntry[]> {
    return await this.timeEntryRepository.find({
      relations: ['task', 'user', 'task.project'],
      order: { date: 'DESC', createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<TimeEntry> {
    const timeEntry = await this.timeEntryRepository.findOne({
      where: { id },
      relations: ['task', 'user', 'task.project'],
    });

    if (!timeEntry) {
      throw new NotFoundException(`Time entry with ID ${id} not found`);
    }

    return timeEntry;
  }

  async update(id: number, updateTimeEntryDto: UpdateTimeEntryDto): Promise<TimeEntry> {
    const { taskId, userId, startTime, endTime, hours, ...timeEntryData } = updateTimeEntryDto;
    const timeEntry = await this.findOne(id);
    const oldTaskId = timeEntry.task.id;

    // Update task if provided
    if (taskId && taskId !== timeEntry.task.id) {
      const task = await this.taskRepository.findOne({ where: { id: taskId } });
      if (!task) {
        throw new NotFoundException(`Task with ID ${taskId} not found`);
      }
      timeEntry.task = task;
    }

    // Update user if provided
    if (userId && userId !== timeEntry.user.id) {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }
      timeEntry.user = user;
    }

    // Validate time logic if updating times and hours
    if (startTime && endTime && hours) {
      const calculatedHours = this.calculateHours(startTime, endTime);
      if (Math.abs(calculatedHours - hours) > 0.5) {
        throw new BadRequestException(
          `Hours logged (${hours}) don't match the calculated time difference (${calculatedHours})`
        );
      }
    }

    Object.assign(timeEntry, timeEntryData);
    if (hours !== undefined) timeEntry.hours = hours;
    if (startTime !== undefined) timeEntry.startTime = startTime;
    if (endTime !== undefined) timeEntry.endTime = endTime;

    const updatedTimeEntry = await this.timeEntryRepository.save(timeEntry);

    // Update logged hours for both old and new tasks
    await this.updateTaskLoggedHours(oldTaskId);
    if (taskId && taskId !== oldTaskId) {
      await this.updateTaskLoggedHours(taskId);
    }

    return updatedTimeEntry;
  }

  async remove(id: number): Promise<void> {
    const timeEntry = await this.findOne(id);
    const taskId = timeEntry.task.id;
    
    await this.timeEntryRepository.remove(timeEntry);
    
    // Update task's logged hours after removal
    await this.updateTaskLoggedHours(taskId);
  }

  async findByUser(userId: string): Promise<TimeEntry[]> {
    return await this.timeEntryRepository.find({
      where: { user: { id: userId } },
      relations: ['task', 'task.project'],
      order: { date: 'DESC', createdAt: 'DESC' },
    });
  }

  async findByTask(taskId: number): Promise<TimeEntry[]> {
    return await this.timeEntryRepository.find({
      where: { task: { id: taskId } },
      relations: ['user'],
      order: { date: 'DESC', createdAt: 'DESC' },
    });
  }

  async findByProject(projectId: number): Promise<TimeEntry[]> {
    return await this.timeEntryRepository.find({
      where: { task: { project: { id: projectId } } },
      relations: ['task', 'user'],
      order: { date: 'DESC', createdAt: 'DESC' },
    });
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<TimeEntry[]> {
    return await this.timeEntryRepository.find({
      where: {
        date: Between(startDate, endDate),
      },
      relations: ['task', 'user', 'task.project'],
      order: { date: 'DESC', createdAt: 'DESC' },
    });
  }

  async findBillableHours(userId?: string, startDate?: Date, endDate?: Date): Promise<TimeEntry[]> {
    const whereConditions: any = { billable: true };

    if (userId) {
      whereConditions.user = { id: userId };
    }

    if (startDate && endDate) {
      whereConditions.date = Between(startDate, endDate);
    }

    return await this.timeEntryRepository.find({
      where: whereConditions,
      relations: ['task', 'user', 'task.project'],
      order: { date: 'DESC' },
    });
  }

  async getTotalHoursByUser(userId: string, startDate?: Date, endDate?: Date): Promise<{
    totalHours: number;
    billableHours: number;
    nonBillableHours: number;
  }> {
    const whereConditions: any = { user: { id: userId } };

    if (startDate && endDate) {
      whereConditions.date = Between(startDate, endDate);
    }

    const timeEntries = await this.timeEntryRepository.find({
      where: whereConditions,
    });

    const totalHours = timeEntries.reduce((sum, entry) => sum + entry.hours, 0);
    const billableHours = timeEntries
      .filter(entry => entry.billable)
      .reduce((sum, entry) => sum + entry.hours, 0);
    const nonBillableHours = totalHours - billableHours;

    return {
      totalHours,
      billableHours,
      nonBillableHours,
    };
  }

  async getTotalHoursByProject(projectId: number): Promise<{
    totalHours: number;
    billableHours: number;
    nonBillableHours: number;
  }> {
    const timeEntries = await this.timeEntryRepository.find({
      where: { task: { project: { id: projectId } } },
    });

    const totalHours = timeEntries.reduce((sum, entry) => sum + entry.hours, 0);
    const billableHours = timeEntries
      .filter(entry => entry.billable)
      .reduce((sum, entry) => sum + entry.hours, 0);
    const nonBillableHours = totalHours - billableHours;

    return {
      totalHours,
      billableHours,
      nonBillableHours,
    };
  }

  async getWeeklyTimesheet(userId: string, weekStart: Date): Promise<TimeEntry[]> {
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    return await this.timeEntryRepository.find({
      where: {
        user: { id: userId },
        date: Between(weekStart, weekEnd),
      },
      relations: ['task', 'task.project'],
      order: { date: 'ASC', startTime: 'ASC' },
    });
  }

  private calculateHours(startTime: string, endTime: string): number {
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    
    const startTotalMinutes = startHour * 60 + startMinute;
    const endTotalMinutes = endHour * 60 + endMinute;
    
    // Handle overnight work (end time is next day)
    const totalMinutes = endTotalMinutes >= startTotalMinutes 
      ? endTotalMinutes - startTotalMinutes
      : (24 * 60) - startTotalMinutes + endTotalMinutes;
    
    return Math.round((totalMinutes / 60) * 100) / 100; // Round to 2 decimal places
  }

  private async updateTaskLoggedHours(taskId: number): Promise<void> {
    const timeEntries = await this.timeEntryRepository.find({
      where: { task: { id: taskId } },
    });

    const totalLoggedHours = timeEntries.reduce((sum, entry) => sum + entry.hours, 0);

    await this.taskRepository.update(taskId, { loggedHours: totalLoggedHours });
  }
}