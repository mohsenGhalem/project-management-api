import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Team } from './entities/team.entity';
import { User } from '../users/entities/user.entity';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { Project } from 'src/projects/entites/project.entity';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  async create(createTeamDto: CreateTeamDto): Promise<Team> {
    const { memberIds, leadId, projectIds, ...teamData } = createTeamDto;

    // Find team members
    let members: User[] = [];
    if (memberIds && memberIds.length > 0) {
      members = await this.userRepository.find({ where: { id: In(memberIds) } });
    }

    // Find team lead
    let lead: User | null = null;
    if (leadId) {
      lead = await this.userRepository.findOne({ where: { id: leadId } });
      if (!lead) {
        throw new NotFoundException(`Team lead with ID ${leadId} not found`);
      }
    }

    // Find projects
    let projects: Project[] = [];
    if (projectIds && projectIds.length > 0) {
      projects = await this.projectRepository.find({ where: { id: In(projectIds) } });
    }

    const team = this.teamRepository.create({
      ...teamData,
      members,
      projects,
      ...(lead ? { lead } : {}),
    });

    return await this.teamRepository.save(team);
  }

  async findAll(): Promise<Team[]> {
    return await this.teamRepository.find({
      relations: ['members', 'lead', 'projects'],
    });
  }

  async findOne(id: number): Promise<Team> {
    const team = await this.teamRepository.findOne({
      where: { id },
      relations: ['members', 'lead', 'projects'],
    });

    if (!team) {
      throw new NotFoundException(`Team with ID ${id} not found`);
    }

    return team;
  }

  async update(id: number, updateTeamDto: UpdateTeamDto): Promise<Team> {
    const team = await this.findOne(id);
    const { memberIds, leadId, projectIds, ...teamData } = updateTeamDto;

    // Update members if provided
    if (memberIds) {
      const members = await this.userRepository.find({ where: { id: In(memberIds) } });
      team.members = members;
    }

    // Update lead if provided
    if (leadId) {
      const lead = await this.userRepository.findOne({ where: { id: leadId } });
      if (!lead) {
        throw new NotFoundException(`Team lead with ID ${leadId} not found`);
      }
      team.lead = lead;
    }

    // Update projects if provided
    if (projectIds) {
      const projects = await this.projectRepository.find({ where: { id: In(projectIds) } });
      team.projects = projects;
    }

    Object.assign(team, teamData);
    return await this.teamRepository.save(team);
  }

  async remove(id: number): Promise<void> {
    const team = await this.findOne(id);
    await this.teamRepository.remove(team);
  }

  async findByDepartment(department: string): Promise<Team[]> {
    return await this.teamRepository.find({
      where: { department: department as any },
      relations: ['members', 'lead'],
    });
  }
}