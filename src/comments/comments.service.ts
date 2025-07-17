import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { User } from '../users/entities/user.entity';
import { Task } from '../tasks/entities/task.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  async create(createCommentDto: CreateCommentDto): Promise<Comment> {
    const { authorId, taskId, parentCommentId, ...commentData } = createCommentDto;

    // Find author
    const author = await this.userRepository.findOne({ where: { id: authorId } });
    if (!author) {
      throw new NotFoundException(`Author with ID ${authorId} not found`);
    }

    // Find task
    const task = await this.taskRepository.findOne({ where: { id: taskId } });
    if (!task) {
      throw new NotFoundException(`Task with ID ${taskId} not found`);
    }

    // Find parent comment if provided
    let parentComment: Comment | null = null;
    if (parentCommentId) {
      parentComment = await this.commentRepository.findOne({ 
        where: { id: parentCommentId },
        relations: ['task']
      });
      if (!parentComment) {
        throw new NotFoundException(`Parent comment with ID ${parentCommentId} not found`);
      }
      // Ensure parent comment belongs to the same task
      if (parentComment.task.id !== taskId) {
        throw new BadRequestException('Parent comment must belong to the same task');
      }
    }

    // Create new comment
    const commentDataa = {
      ...commentData,
      author,
      task,
      mentions: createCommentDto.mentions || [],
      reactions: createCommentDto.reactions || {},
    };
    
    // Only add parentComment if it exists
    if (parentComment) {
      commentData['parentComment'] = parentComment;
    }
    
    const comment = this.commentRepository.create(commentDataa);

    return await this.commentRepository.save(comment);
  }

  async findAll(): Promise<Comment[]> {
    return await this.commentRepository.find({
      relations: ['author', 'task', 'parentComment', 'replies'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Comment> {
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: ['author', 'task', 'parentComment', 'replies'],
    });

    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }

    return comment;
  }

  async findByTask(taskId: number): Promise<Comment[]> {
    // Verify task exists
    const task = await this.taskRepository.findOne({ where: { id: taskId } });
    if (!task) {
      throw new NotFoundException(`Task with ID ${taskId} not found`);
    }

    return await this.commentRepository.find({
      where: { task: { id: taskId } },
      relations: ['author', 'parentComment', 'replies', 'replies.author'],
      order: { createdAt: 'ASC', replies: { createdAt: 'ASC' } },
    });
  }

  async findByUser(userId: string): Promise<Comment[]> {
    // Verify user exists
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return await this.commentRepository.find({
      where: { author: { id: userId } },
      relations: ['task', 'task.project', 'parentComment', 'replies'],
      order: { createdAt: 'DESC' },
    });
  }

  async findReplies(parentCommentId: number): Promise<Comment[]> {
    const parentComment = await this.findOne(parentCommentId);

    if (!parentComment) {
      throw new NotFoundException(`Parent comment with ID ${parentCommentId} not found`);
    }
    
    return await this.commentRepository.find({
      where: { parentComment: { id: parentCommentId } },
      relations: ['author', 'replies'],
      order: { createdAt: 'ASC' },
    });
  }

  async update(id: number, updateCommentDto: UpdateCommentDto): Promise<Comment> {
    const comment = await this.findOne(id);
    
    // Don't allow changing author, task, or parent comment
    const { authorId, taskId, parentCommentId, ...updateData } = updateCommentDto;
    
    Object.assign(comment, updateData);
    return await this.commentRepository.save(comment);
  }

  async remove(id: number): Promise<void> {
    const comment = await this.findOne(id);
    
    // Check if comment has replies
    const replies = await this.commentRepository.find({
      where: { parentComment: { id } }
    });
    
    if (replies.length > 0) {
      throw new BadRequestException('Cannot delete comment that has replies. Delete replies first.');
    }
    
    await this.commentRepository.remove(comment);
  }

  async addReaction(commentId: number, emoji: string, userId: string): Promise<Comment> {
    const comment = await this.findOne(commentId);
    
    // Verify user exists
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Initialize reactions if not exists
    if (!comment.reactions) {
      comment.reactions = {};
    }

    // Initialize emoji array if not exists
    if (!comment.reactions[emoji]) {
      comment.reactions[emoji] = [];
    }

    // Add user to emoji reactions if not already present
    if (!comment.reactions[emoji].includes(userId)) {
      comment.reactions[emoji].push(userId);
    }

    return await this.commentRepository.save(comment);
  }

  async removeReaction(commentId: number, emoji: string, userId: string): Promise<Comment> {
    const comment = await this.findOne(commentId);
    
    if (!comment.reactions || !comment.reactions[emoji]) {
      throw new BadRequestException(`No ${emoji} reactions found on this comment`);
    }

    // Remove user from emoji reactions
    comment.reactions[emoji] = comment.reactions[emoji].filter(id => id !== userId);

    // Remove emoji key if no reactions left
    if (comment.reactions[emoji].length === 0) {
      delete comment.reactions[emoji];
    }

    return await this.commentRepository.save(comment);
  }

  async findWithMentions(userId: string): Promise<Comment[]> {
    // Find user to get their name for mention matching
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Find comments that mention this user
    const comments = await this.commentRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.author', 'author')
      .leftJoinAndSelect('comment.task', 'task')
      .leftJoinAndSelect('task.project', 'project')
      .where(':userName = ANY(comment.mentions)', { userName: user.name })
      .orderBy('comment.createdAt', 'DESC')
      .getMany();

    return comments;
  }

  async getCommentStats(taskId?: number, userId?: string): Promise<{
    totalComments: number;
    totalReplies: number;
    uniqueParticipants: number;
    recentActivity: Date | null;
  }> {
    let query = this.commentRepository.createQueryBuilder('comment')
      .leftJoinAndSelect('comment.author', 'author')
      .leftJoinAndSelect('comment.task', 'task');

    if (taskId) {
      query = query.where('task.id = :taskId', { taskId });
    }

    if (userId) {
      query = query.andWhere('author.id = :userId', { userId });
    }

    const comments = await query.getMany();

    const totalComments = comments.filter(c => !c.parentComment).length;
    const totalReplies = comments.filter(c => c.parentComment).length;
    const uniqueParticipants = new Set(comments.map(c => c.author.id)).size;
    const recentActivity = comments.length > 0 
      ? new Date(Math.max(...comments.map(c => c.createdAt.getTime())))
      : null;

    return {
      totalComments,
      totalReplies,
      uniqueParticipants,
      recentActivity,
    };
  }
}