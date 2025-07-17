import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './entites/project.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createProjectDto: CreateProjectDto): Promise<Project> {
    const { ownerId, teamIds, ...projectData } = createProjectDto;

    // Find owner
    const owner = await this.userRepository.findOne({ where: { id: ownerId } });
    if (!owner) {
      throw new NotFoundException(`Owner with ID ${ownerId} not found`);
    }

    // Find team members
    let team: User[] = [];
    if (teamIds && teamIds.length > 0) {
      team = await this.userRepository.find({ where: { id: In(teamIds) } });
    }

    const project = this.projectRepository.create({
      ...projectData,
      owner,
      team,
    });

    return await this.projectRepository.save(project);
  }

  async findAll(): Promise<Project[]> {
    return await this.projectRepository.find({
      relations: ['owner', 'team', 'tasks', 'sprints'],
    });
  }

  async findOne(id: number): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: ['owner', 'team', 'tasks', 'sprints', 'analytics'],
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    return project;
  }

  async update(id: number, updateProjectDto: UpdateProjectDto): Promise<Project> {
    const { ownerId, teamIds, ...projectData } = updateProjectDto;
    const project = await this.findOne(id);

    // Update owner if provided
    if (ownerId) {
      const owner = await this.userRepository.findOne({ where: { id: ownerId } });
      if (!owner) {
        throw new NotFoundException(`Owner with ID ${ownerId} not found`);
      }
      project.owner = owner;
    }

    // Update team if provided
    if (teamIds) {
      const team = await this.userRepository.find({ where: { id: In(teamIds) } });
      project.team = team;
    }

    Object.assign(project, projectData);
    return await this.projectRepository.save(project);
  }

  async remove(id: number): Promise<void> {
    const project = await this.findOne(id);
    await this.projectRepository.remove(project);
  }

  async findByOwner(ownerId: string): Promise<Project[]> {
    return await this.projectRepository.find({
      where: { owner: { id: ownerId } },
      relations: ['owner', 'team', 'tasks'],
    });
  }

  async findByStatus(status: string): Promise<Project[]> {
    return await this.projectRepository.find({
      where: { status: status as any },
      relations: ['owner', 'team'],
    });
  }

  async addTeamMember(projectId: number, userId: string): Promise<Project> {
    const project = await this.findOne(projectId);
    const user = await this.userRepository.findOne({ where: { id: userId } });
    
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    if (!project.team.find(member => member.id === userId)) {
      project.team.push(user);
      return await this.projectRepository.save(project);
    }

    return project;
  }

  async removeTeamMember(projectId: number, userId: string): Promise<Project> {
    const project = await this.findOne(projectId);
    project.team = project.team.filter(member => member.id !== userId);
    return await this.projectRepository.save(project);
  }
}

 