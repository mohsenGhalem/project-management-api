
export enum UserRole {
  PROJECT_MANAGER = 'project_manager',
  DEVELOPER = 'developer',
  DESIGNER = 'designer',
  QA_TESTER = 'qa_tester',
  TEAM_LEAD = 'team_lead',
  MOBILE_LEAD = 'mobile_lead',
}

export enum Department {
  ENGINEERING = 'Engineering',
  DESIGN = 'Design',
  PRODUCT = 'Product',
  QA = 'QA',
  MARKETING = 'Marketing',
  MOBILE = 'Mobile',
}

export enum ProjectStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  ON_HOLD = 'on-hold',
  ARCHIVED = 'archived',
}

export enum ProjectPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in-progress',
  REVIEW = 'review',
  DONE = 'done',
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export enum SprintStatus {
  PLANNED = 'planned',
  ACTIVE = 'active',
  COMPLETED = 'completed',
}

export enum NotificationType {
  TASK_ASSIGNED = 'task_assigned',
  TASK_DUE_SOON = 'task_due_soon',
  COMMENT_MENTION = 'comment_mention',
  PROJECT_UPDATE = 'project_update',
  TIME_LOGGED = 'time_logged',
  TASK_COMPLETED = 'task_completed',
}

export enum RelatedType {
  TASK = 'task',
  PROJECT = 'project',
  COMMENT = 'comment',
  SPRINT = 'sprint',
}

export enum NotificationPriority {
  LOW = 'low',
  NORMAL = 'normal',
  HIGH = 'high',
}

export enum MediaType {
  IMAGE = 'image',
  DOCUMENT = 'document',
  VIDEO = 'video',
  AUDIO = 'audio',
}

export enum TemplateCategory {
  SOFTWARE_DEVELOPMENT = 'Software Development',
  MARKETING_CAMPAIGN = 'Marketing Campaign',
  PRODUCT_LAUNCH = 'Product Launch',
  RESEARCH = 'Research',
  DESIGN = 'Design',
}

export enum TemplateComplexity {
  SIMPLE = 'simple',
  MEDIUM = 'medium',
  COMPLEX = 'complex',
}

export enum ActivityType {
  TASK_CREATED = 'task_created',
  TASK_UPDATED = 'task_updated',
  TASK_COMPLETED = 'task_completed',
  COMMENT_ADDED = 'comment_added',
  FILE_UPLOADED = 'file_uploaded',
  USER_JOINED = 'user_joined',
  PROJECT_CREATED = 'project_created',
}

export enum EntityType {
  TASK = 'task',
  PROJECT = 'project',
  COMMENT = 'comment',
  FILE = 'file',
  USER = 'user',
}