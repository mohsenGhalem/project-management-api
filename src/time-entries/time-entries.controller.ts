import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { TimeEntriesService } from './time-entries.service';
import { CreateTimeEntryDto } from './dto/create-time-entry.dto';
import { UpdateTimeEntryDto } from './dto/update-time-entry.dto';
import { TimeEntry } from './entities/time-entry.entity';

@ApiTags('time-entries')
@Controller('time-entries')
export class TimeEntriesController {
  constructor(private readonly timeEntriesService: TimeEntriesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new time entry' })
  @ApiResponse({ status: 201, description: 'Time entry created successfully', type: TimeEntry })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 404, description: 'Task or User not found' })
  create(@Body() createTimeEntryDto: CreateTimeEntryDto): Promise<TimeEntry> {
    return this.timeEntriesService.create(createTimeEntryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all time entries' })
  @ApiResponse({ status: 200, description: 'List of all time entries', type: [TimeEntry] })
  @ApiQuery({ name: 'user', required: false, description: 'Filter by user ID' })
  @ApiQuery({ name: 'task', required: false, description: 'Filter by task ID' })
  @ApiQuery({ name: 'project', required: false, description: 'Filter by project ID' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Filter from start date (YYYY-MM-DD)' })
  @ApiQuery({ name: 'endDate', required: false, description: 'Filter to end date (YYYY-MM-DD)' })
  @ApiQuery({ name: 'billable', required: false, description: 'Filter by billable status (true/false)' })
  findAll(
    @Query('user') userId?: string,
    @Query('task') taskId?: string,
    @Query('project') projectId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('billable') billable?: string,
  ): Promise<TimeEntry[]> {
    // Handle billable hours filter
    if (billable === 'true') {
      const start = startDate ? new Date(startDate) : undefined;
      const end = endDate ? new Date(endDate) : undefined;
      return this.timeEntriesService.findBillableHours(userId, start, end);
    }

    // Handle date range filter
    if (startDate && endDate) {
      return this.timeEntriesService.findByDateRange(new Date(startDate), new Date(endDate));
    }

    // Handle specific filters
    if (userId) {
      return this.timeEntriesService.findByUser(userId);
    }
    if (taskId) {
      return this.timeEntriesService.findByTask(+taskId);
    }
    if (projectId) {
      return this.timeEntriesService.findByProject(+projectId);
    }

    return this.timeEntriesService.findAll();
  }

  @Get('reports/user/:userId/total')
  @ApiOperation({ summary: 'Get total hours summary for a user' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Start date for report (YYYY-MM-DD)' })
  @ApiQuery({ name: 'endDate', required: false, description: 'End date for report (YYYY-MM-DD)' })
  @ApiResponse({ 
    status: 200, 
    description: 'User total hours summary',
    schema: {
      type: 'object',
      properties: {
        totalHours: { type: 'number' },
        billableHours: { type: 'number' },
        nonBillableHours: { type: 'number' },
      },
    },
  })
  getUserTotalHours(
    @Param('userId') userId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.timeEntriesService.getTotalHoursByUser(userId, start, end);
  }

  @Get('reports/project/:projectId/total')
  @ApiOperation({ summary: 'Get total hours summary for a project' })
  @ApiParam({ name: 'projectId', description: 'Project ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Project total hours summary',
    schema: {
      type: 'object',
      properties: {
        totalHours: { type: 'number' },
        billableHours: { type: 'number' },
        nonBillableHours: { type: 'number' },
      },
    },
  })
  getProjectTotalHours(@Param('projectId') projectId: string) {
    return this.timeEntriesService.getTotalHoursByProject(+projectId);
  }

  @Get('timesheet/user/:userId/week')
  @ApiOperation({ summary: 'Get weekly timesheet for a user' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiQuery({ name: 'weekStart', description: 'Start of week date (YYYY-MM-DD, should be Monday)' })
  @ApiResponse({ status: 200, description: 'Weekly timesheet entries', type: [TimeEntry] })
  getWeeklyTimesheet(
    @Param('userId') userId: string,
    @Query('weekStart') weekStart: string,
  ): Promise<TimeEntry[]> {
    return this.timeEntriesService.getWeeklyTimesheet(userId, new Date(weekStart));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get time entry by ID' })
  @ApiParam({ name: 'id', description: 'Time entry ID' })
  @ApiResponse({ status: 200, description: 'Time entry found', type: TimeEntry })
  @ApiResponse({ status: 404, description: 'Time entry not found' })
  findOne(@Param('id') id: string): Promise<TimeEntry> {
    return this.timeEntriesService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update time entry' })
  @ApiParam({ name: 'id', description: 'Time entry ID' })
  @ApiResponse({ status: 200, description: 'Time entry updated successfully', type: TimeEntry })
  @ApiResponse({ status: 404, description: 'Time entry not found' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  update(@Param('id') id: string, @Body() updateTimeEntryDto: UpdateTimeEntryDto): Promise<TimeEntry> {
    return this.timeEntriesService.update(+id, updateTimeEntryDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete time entry' })
  @ApiParam({ name: 'id', description: 'Time entry ID' })
  @ApiResponse({ status: 200, description: 'Time entry deleted successfully' })
  @ApiResponse({ status: 404, description: 'Time entry not found' })
  remove(@Param('id') id: string): Promise<void> {
    return this.timeEntriesService.remove(+id);
  }
}