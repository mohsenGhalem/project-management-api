import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { User } from '../users/entities/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Project } from 'src/projects/entites/project.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const { assigneeId, reporterId, projectId, parentTaskId, ...taskData } = createTaskDto;

    // Find reporter (required)
    const reporter = await this.userRepository.findOne({ where: { id: reporterId } });
    if (!reporter) {
      throw new NotFoundException(`Reporter with ID ${reporterId} not found`);
    }

    // Find project (required)
    const project = await this.projectRepository.findOne({ where: { id: projectId } });
    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }

    // Find assignee (optional)
    let assignee: User | null = null;
    if (assigneeId) {
      assignee = await this.userRepository.findOne({ where: { id: assigneeId } });
      if (!assignee) {
        throw new NotFoundException(`Assignee with ID ${assigneeId} not found`);
      }
    }

    // Find parent task (optional)
    let parentTask: Task | null = null;
    if (parentTaskId) {
      parentTask = await this.taskRepository.findOne({ where: { id: parentTaskId } });
      if (!parentTask) {
        throw new NotFoundException(`Parent task with ID ${parentTaskId} not found`);
      }
    }

    const task = this.taskRepository.create({
      ...taskData,
      assignee,
      reporter,
      project,
      parentTask,
    } as unknown as DeepPartial<Task>);

    return await this.taskRepository.save(task);
  }

  async findAll(): Promise<Task[]> {
    return await this.taskRepository.find({
      relations: ['assignee', 'reporter', 'project', 'parentTask', 'subtasks', 'comments'],
    });
  }

  async findOne(id: number): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ['assignee', 'reporter', 'project', 'parentTask', 'subtasks', 'comments', 'timeEntries'],
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return task;
  }

  async update(id: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const { assigneeId, reporterId, projectId, parentTaskId, ...taskData } = updateTaskDto;
    const task = await this.findOne(id);

    // Update assignee if provided
    if (assigneeId) {
      const assignee = await this.userRepository.findOne({ where: { id: assigneeId } });
      if (!assignee) {
        throw new NotFoundException(`Assignee with ID ${assigneeId} not found`);
      }
      task.assignee = assignee;
    }

    // Update reporter if provided
    if (reporterId) {
      const reporter = await this.userRepository.findOne({ where: { id: reporterId } });
      if (!reporter) {
        throw new NotFoundException(`Reporter with ID ${reporterId} not found`);
      }
      task.reporter = reporter;
    }

    // Update project if provided
    if (projectId) {
      const project = await this.projectRepository.findOne({ where: { id: projectId } });
      if (!project) {
        throw new NotFoundException(`Project with ID ${projectId} not found`);
      }
      task.project = project;
    }

    // Update parent task if provided
    if (parentTaskId) {
      const parentTask = await this.taskRepository.findOne({ where: { id: parentTaskId } });
      if (!parentTask) {
        throw new NotFoundException(`Parent task with ID ${parentTaskId} not found`);
      }
      task.parentTask = parentTask;
    }

    Object.assign(task, taskData);
    return await this.taskRepository.save(task);
  }

  async remove(id: number): Promise<void> {
    const task = await this.findOne(id);
    await this.taskRepository.remove(task);
  }

  async findByProject(projectId: number): Promise<Task[]> {
    return await this.taskRepository.find({
      where: { project: { id: projectId } },
      relations: ['assignee', 'reporter', 'parentTask', 'subtasks'],
    });
  }

  async findByAssignee(assigneeId: string): Promise<Task[]> {
    return await this.taskRepository.find({
      where: { assignee: { id: assigneeId } },
      relations: ['project', 'reporter', 'parentTask'],
    });
  }

  async findByStatus(status: string): Promise<Task[]> {
    return await this.taskRepository.find({
      where: { status: status as any },
      relations: ['assignee', 'reporter', 'project'],
    });
  }

  async updateLoggedHours(id: number, hours: number): Promise<Task> {
    const task = await this.findOne(id);
    task.loggedHours = (task.loggedHours || 0) + hours;
    return await this.taskRepository.save(task);
  }
}