// scripts/seed-data.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { UsersService } from '../src/users/users.service';
import { ProjectsService } from '../src/projects/projects.service';
import { TasksService } from '../src/tasks/tasks.service';
import { TeamsService } from '../src/teams/teams.service';
import { 
  UserRole, 
  Department, 
  ProjectStatus, 
  ProjectPriority, 
  TaskStatus, 
  TaskPriority 
} from '../src/common/enums';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  
  const usersService = app.get(UsersService);
  const projectsService = app.get(ProjectsService);
  const tasksService = app.get(TasksService);
  const teamsService = app.get(TeamsService);

  console.log('🌱 Starting database seeding...');

  try {
    // Create sample users
    console.log('👥 Creating users...');
    
    const johnDoe = await usersService.create({
      name: 'John Doe',
      email: 'john.doe@ranwip.com',
      role: UserRole.PROJECT_MANAGER,
      department: Department.ENGINEERING,
      skills: ['project-management', 'agile', 'scrum'],
      capacity: 40,
      workload: 32,
      timezone: 'America/New_York',
      workingHours: { start: '09:00', end: '17:00' },
      bio: 'Experienced project manager with 5+ years in software development.',
    });

    const sarahWilson = await usersService.create({
      name: 'Sarah Wilson',
      email: 'sarah.wilson@ranwip.com',
      role: UserRole.DEVELOPER,
      department: Department.ENGINEERING,
      skills: ['react', 'typescript', 'nodejs', 'postgresql'],
      capacity: 40,
      workload: 35,
      timezone: 'America/New_York',
      workingHours: { start: '09:00', end: '17:00' },
      bio: 'Full-stack developer specializing in modern web technologies.',
    });

    const mikeJohnson = await usersService.create({
      name: 'Mike Johnson',
      email: 'mike.johnson@ranwip.com',
      role: UserRole.DESIGNER,
      department: Department.DESIGN,
      skills: ['ui-design', 'ux-research', 'figma', 'prototyping'],
      capacity: 40,
      workload: 28,
      timezone: 'America/Los_Angeles',
      workingHours: { start: '10:00', end: '18:00' },
      bio: 'Creative designer with expertise in user experience and interface design.',
    });

    const emilyDavis = await usersService.create({
      name: 'Emily Davis',
      email: 'emily.davis@ranwip.com',
      role: UserRole.QA_TESTER,
      department: Department.QA,
      skills: ['testing', 'automation', 'cypress', 'jest'],
      capacity: 40,
      workload: 30,
      timezone: 'America/Chicago',
      workingHours: { start: '08:00', end: '16:00' },
      bio: 'Quality assurance specialist focused on automated testing and user experience.',
    });

    const alexChen = await usersService.create({
      name: 'Alex Chen',
      email: 'alex.chen@ranwip.com',
      role: UserRole.TEAM_LEAD,
      department: Department.ENGINEERING,
      skills: ['leadership', 'architecture', 'microservices', 'aws'],
      capacity: 40,
      workload: 38,
      timezone: 'America/New_York',
      workingHours: { start: '09:00', end: '17:00' },
      bio: 'Technical lead with expertise in system architecture and team management.',
    });

    const jessicaBrown = await usersService.create({
      name: 'Jessica Brown',
      email: 'jessica.brown@ranwip.com',
      role: UserRole.MOBILE_LEAD,
      department: Department.MOBILE,
      skills: ['react-native', 'swift', 'kotlin', 'flutter'],
      capacity: 40,
      workload: 36,
      timezone: 'America/Denver',
      workingHours: { start: '08:30', end: '16:30' },
      bio: 'Mobile development expert with cross-platform experience.',
    });

    const davidLee = await usersService.create({
      name: 'David Lee',
      email: 'david.lee@ranwip.com',
      role: UserRole.DEVELOPER,
      department: Department.ENGINEERING,
      skills: ['python', 'django', 'docker', 'kubernetes'],
      capacity: 40,
      workload: 40,
      timezone: 'America/New_York',
      workingHours: { start: '09:00', end: '17:00' },
      bio: 'Backend developer with DevOps expertise.',
    });

    const mariaGarcia = await usersService.create({
      name: 'Maria Garcia',
      email: 'maria.garcia@ranwip.com',
      role: UserRole.DESIGNER,
      department: Department.DESIGN,
      skills: ['brand-design', 'illustration', 'adobe-creative', 'motion-graphics'],
      capacity: 40,
      workload: 25,
      timezone: 'America/Los_Angeles',
      workingHours: { start: '10:00', end: '18:00' },
      bio: 'Brand and visual designer with motion graphics expertise.',
    });

    // Create sample teams
    console.log('🏢 Creating teams...');
    
    const frontendTeam = await teamsService.create({
      name: 'Frontend Development Team',
      description: 'Responsible for user interface and user experience development',
      department: Department.ENGINEERING,
      memberIds: [sarahWilson.id, mikeJohnson.id],
      leadId: alexChen.id,
      budget: 150000,
      headcount: 3,
    });

    const qaTeam = await teamsService.create({
      name: 'Quality Assurance Team',
      description: 'Ensures product quality through comprehensive testing',
      department: Department.QA,
      memberIds: [emilyDavis.id],
      leadId: emilyDavis.id,
      budget: 80000,
      headcount: 2,
    });

    const mobileTeam = await teamsService.create({
      name: 'Mobile Development Team',
      description: 'Cross-platform mobile application development',
      department: Department.MOBILE,
      memberIds: [jessicaBrown.id, sarahWilson.id],
      leadId: jessicaBrown.id,
      budget: 120000,
      headcount: 3,
    });

    const designTeam = await teamsService.create({
      name: 'Design Team',
      description: 'UI/UX design and brand development',
      department: Department.DESIGN,
      memberIds: [mikeJohnson.id, mariaGarcia.id],
      leadId: mikeJohnson.id,
      budget: 100000,
      headcount: 2,
    });

    const backendTeam = await teamsService.create({
      name: 'Backend Engineering Team',
      description: 'Server-side development and infrastructure',
      department: Department.ENGINEERING,
      memberIds: [davidLee.id, alexChen.id],
      leadId: alexChen.id,
      budget: 180000,
      headcount: 4,
    });

    // Create sample projects
    console.log('📋 Creating projects...');
    
    const webRedesign = await projectsService.create({
      name: 'Company Website Redesign',
      description: 'Complete overhaul of the company website with modern design and improved user experience',
      status: ProjectStatus.ACTIVE,
      priority: ProjectPriority.HIGH,
      startDate: new Date('2025-01-01'),
      endDate: new Date('2025-03-31'),
      progress: 35,
      budget: 75000,
      spent: 26250,
      tags: ['website', 'redesign', 'ui-ux', 'frontend'],
      ownerId: johnDoe.id,
      teamIds: [sarahWilson.id, mikeJohnson.id, emilyDavis.id],
      milestones: [
        {
          id: 1,
          name: 'Design Mockups Complete',
          date: new Date('2025-01-15'),
          completed: true,
          description: 'All design mockups and wireframes completed'
        },
        {
          id: 2,
          name: 'Frontend Development Complete',
          date: new Date('2025-02-28'),
          completed: false,
          description: 'Frontend development and integration finished'
        },
        {
          id: 3,
          name: 'Testing and Launch',
          date: new Date('2025-03-31'),
          completed: false,
          description: 'Final testing, bug fixes, and website launch'
        }
      ],
    });

    const mobileApp = await projectsService.create({
      name: 'RANWIP Mobile Application',
      description: 'Development of a cross-platform mobile application for project management',
      status: ProjectStatus.ACTIVE,
      priority: ProjectPriority.HIGH,
      startDate: new Date('2025-02-01'),
      endDate: new Date('2025-06-30'),
      progress: 15,
      budget: 120000,
      spent: 18000,
      tags: ['mobile', 'react-native', 'ios', 'android'],
      ownerId: alexChen.id,
      teamIds: [jessicaBrown.id, sarahWilson.id, emilyDavis.id],
      milestones: [
        {
          id: 1,
          name: 'Requirements Analysis',
          date: new Date('2025-02-15'),
          completed: true,
          description: 'Complete requirements gathering and analysis'
        },
        {
          id: 2,
          name: 'MVP Development',
          date: new Date('2025-04-30'),
          completed: false,
          description: 'Minimum viable product development'
        },
        {
          id: 3,
          name: 'Beta Testing',
          date: new Date('2025-05-31'),
          completed: false,
          description: 'Beta testing with internal users'
        },
        {
          id: 4,
          name: 'Production Launch',
          date: new Date('2025-06-30'),
          completed: false,
          description: 'Production deployment and launch'
        }
      ],
    });

    const apiRefactor = await projectsService.create({
      name: 'API Architecture Refactor',
      description: 'Modernize backend API architecture for better scalability and performance',
      status: ProjectStatus.ACTIVE,
      priority: ProjectPriority.MEDIUM,
      startDate: new Date('2025-01-15'),
      endDate: new Date('2025-04-15'),
      progress: 25,
      budget: 90000,
      spent: 22500,
      tags: ['backend', 'api', 'refactor', 'microservices'],
      ownerId: alexChen.id,
      teamIds: [davidLee.id, alexChen.id],
      milestones: [
        {
          id: 1,
          name: 'Architecture Planning',
          date: new Date('2025-02-01'),
          completed: true,
          description: 'Complete architecture design and planning'
        },
        {
          id: 2,
          name: 'Migration Phase 1',
          date: new Date('2025-03-01'),
          completed: false,
          description: 'Migrate core services to new architecture'
        },
        {
          id: 3,
          name: 'Migration Complete',
          date: new Date('2025-04-15'),
          completed: false,
          description: 'Complete migration and performance optimization'
        }
      ],
    });

    const brandRefresh = await projectsService.create({
      name: 'Brand Identity Refresh',
      description: 'Update company brand identity including logo, colors, and marketing materials',
      status: ProjectStatus.ACTIVE,
      priority: ProjectPriority.LOW,
      startDate: new Date('2025-01-20'),
      endDate: new Date('2025-05-20'),
      progress: 40,
      budget: 45000,
      spent: 18000,
      tags: ['branding', 'design', 'marketing', 'identity'],
      ownerId: mikeJohnson.id,
      teamIds: [mikeJohnson.id, mariaGarcia.id],
      milestones: [
        {
          id: 1,
          name: 'Brand Strategy',
          date: new Date('2025-02-15'),
          completed: true,
          description: 'Complete brand strategy and guidelines'
        },
        {
          id: 2,
          name: 'Visual Identity',
          date: new Date('2025-03-30'),
          completed: false,
          description: 'Logo, colors, and visual identity design'
        },
        {
          id: 3,
          name: 'Marketing Materials',
          date: new Date('2025-05-20'),
          completed: false,
          description: 'Complete marketing materials and brand rollout'
        }
      ],
    });

    // Create sample tasks
    console.log('✅ Creating tasks...');
    
    // Website Redesign Tasks
    const designTask = await tasksService.create({
      title: 'Create homepage wireframes and mockups',
      description: 'Design comprehensive wireframes and high-fidelity mockups for the new homepage layout including hero section, navigation, and footer',
      status: TaskStatus.DONE,
      priority: TaskPriority.HIGH,
      assigneeId: mikeJohnson.id,
      reporterId: johnDoe.id,
      projectId: webRedesign.id,
      dueDate: new Date('2025-01-10'),
      estimatedHours: 20,
      tags: ['design', 'wireframes', 'homepage', 'ui'],
      storyPoints: 8,
    });

    const navigationTask = await tasksService.create({
      title: 'Implement responsive navigation component',
      description: 'Develop a responsive navigation component using React and TypeScript with mobile-first approach and accessibility features',
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.HIGH,
      assigneeId: sarahWilson.id,
      reporterId: johnDoe.id,
      projectId: webRedesign.id,
      dueDate: new Date('2025-01-25'),
      estimatedHours: 24,
      tags: ['frontend', 'react', 'navigation', 'responsive'],
      storyPoints: 13,
      dependencies: [designTask.id],
    });

    const homepageTask = await tasksService.create({
      title: 'Build homepage components',
      description: 'Create reusable React components for homepage sections including hero, features, testimonials, and CTA',
      status: TaskStatus.TODO,
      priority: TaskPriority.HIGH,
      assigneeId: sarahWilson.id,
      reporterId: johnDoe.id,
      projectId: webRedesign.id,
      dueDate: new Date('2025-02-10'),
      estimatedHours: 32,
      tags: ['frontend', 'react', 'components', 'homepage'],
      storyPoints: 21,
      dependencies: [designTask.id, navigationTask.id],
    });

    const testingTask = await tasksService.create({
      title: 'Write comprehensive test suite for website',
      description: 'Create unit tests, integration tests, and E2E tests for all website components and user flows',
      status: TaskStatus.TODO,
      priority: TaskPriority.MEDIUM,
      assigneeId: emilyDavis.id,
      reporterId: johnDoe.id,
      projectId: webRedesign.id,
      dueDate: new Date('2025-02-20'),
      estimatedHours: 28,
      tags: ['testing', 'unit-tests', 'e2e', 'cypress'],
      storyPoints: 13,
      dependencies: [homepageTask.id],
    });

    // Mobile App Tasks
    const mobileSetupTask = await tasksService.create({
      title: 'Setup React Native project architecture',
      description: 'Initialize React Native project with proper folder structure, navigation, state management, and development tools',
      status: TaskStatus.DONE,
      priority: TaskPriority.HIGH,
      assigneeId: jessicaBrown.id,
      reporterId: alexChen.id,
      projectId: mobileApp.id,
      dueDate: new Date('2025-02-05'),
      estimatedHours: 16,
      tags: ['mobile', 'react-native', 'setup', 'architecture'],
      storyPoints: 8,
    });

    const mobileAuthTask = await tasksService.create({
      title: 'Implement user authentication flow',
      description: 'Build login, signup, and password reset screens with secure authentication integration',
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.HIGH,
      assigneeId: jessicaBrown.id,
      reporterId: alexChen.id,
      projectId: mobileApp.id,
      dueDate: new Date('2025-02-20'),
      estimatedHours: 24,
      tags: ['mobile', 'authentication', 'security', 'ui'],
      storyPoints: 13,
      dependencies: [mobileSetupTask.id],
    });

    const mobileProjectsTask = await tasksService.create({
      title: 'Build project management screens',
      description: 'Create screens for viewing, creating, and managing projects with offline support',
      status: TaskStatus.TODO,
      priority: TaskPriority.HIGH,
      assigneeId: sarahWilson.id,
      reporterId: alexChen.id,
      projectId: mobileApp.id,
      dueDate: new Date('2025-03-15'),
      estimatedHours: 40,
      tags: ['mobile', 'projects', 'offline', 'crud'],
      storyPoints: 21,
      dependencies: [mobileAuthTask.id],
    });

    // API Refactor Tasks
    const apiPlanningTask = await tasksService.create({
      title: 'Design microservices architecture',
      description: 'Create detailed architecture design for microservices including service boundaries, data flow, and API contracts',
      status: TaskStatus.DONE,
      priority: TaskPriority.HIGH,
      assigneeId: alexChen.id,
      reporterId: alexChen.id,
      projectId: apiRefactor.id,
      dueDate: new Date('2025-01-30'),
      estimatedHours: 20,
      tags: ['architecture', 'microservices', 'design', 'api'],
      storyPoints: 8,
    });

    const dockerizationTask = await tasksService.create({
      title: 'Containerize existing services',
      description: 'Create Docker containers and docker-compose setup for all existing services with proper networking',
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.HIGH,
      assigneeId: davidLee.id,
      reporterId: alexChen.id,
      projectId: apiRefactor.id,
      dueDate: new Date('2025-02-15'),
      estimatedHours: 32,
      tags: ['docker', 'containers', 'devops', 'infrastructure'],
      storyPoints: 13,
      dependencies: [apiPlanningTask.id],
    });

    const userServiceTask = await tasksService.create({
      title: 'Migrate user service to new architecture',
      description: 'Extract user management functionality into dedicated microservice with proper authentication',
      status: TaskStatus.TODO,
      priority: TaskPriority.HIGH,
      assigneeId: davidLee.id,
      reporterId: alexChen.id,
      projectId: apiRefactor.id,
      dueDate: new Date('2025-03-01'),
      estimatedHours: 36,
      tags: ['microservices', 'user-service', 'migration', 'auth'],
      storyPoints: 21,
      dependencies: [dockerizationTask.id],
    });

    // Brand Refresh Tasks
    const brandStrategyTask = await tasksService.create({
      title: 'Develop brand strategy and positioning',
      description: 'Research market positioning, define brand values, and create comprehensive brand strategy document',
      status: TaskStatus.DONE,
      priority: TaskPriority.MEDIUM,
      assigneeId: mikeJohnson.id,
      reporterId: mikeJohnson.id,
      projectId: brandRefresh.id,
      dueDate: new Date('2025-02-10'),
      estimatedHours: 24,
      tags: ['branding', 'strategy', 'research', 'positioning'],
      storyPoints: 8,
    });

    const logoDesignTask = await tasksService.create({
      title: 'Design new company logo and brand mark',
      description: 'Create multiple logo concepts, iterations, and final logo with brand mark variations',
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.HIGH,
      assigneeId: mariaGarcia.id,
      reporterId: mikeJohnson.id,
      projectId: brandRefresh.id,
      dueDate: new Date('2025-03-15'),
      estimatedHours: 30,
      tags: ['logo', 'branding', 'visual-identity', 'design'],
      storyPoints: 13,
      dependencies: [brandStrategyTask.id],
    });

    const colorPaletteTask = await tasksService.create({
      title: 'Develop brand color palette and typography',
      description: 'Create comprehensive color system and typography guidelines for brand consistency',
      status: TaskStatus.TODO,
      priority: TaskPriority.MEDIUM,
      assigneeId: mariaGarcia.id,
      reporterId: mikeJohnson.id,
      projectId: brandRefresh.id,
      dueDate: new Date('2025-03-30'),
      estimatedHours: 16,
      tags: ['colors', 'typography', 'brand-guidelines', 'design-system'],
      storyPoints: 5,
      dependencies: [logoDesignTask.id],
    });

    const marketingMaterialsTask = await tasksService.create({
      title: 'Create marketing materials template library',
      description: 'Design templates for business cards, letterhead, presentations, and digital marketing materials',
      status: TaskStatus.TODO,
      priority: TaskPriority.LOW,
      assigneeId: mariaGarcia.id,
      reporterId: mikeJohnson.id,
      projectId: brandRefresh.id,
      dueDate: new Date('2025-05-15'),
      estimatedHours: 40,
      tags: ['marketing', 'templates', 'print-design', 'digital-assets'],
      storyPoints: 21,
      dependencies: [colorPaletteTask.id],
    });

    console.log('✨ Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`👥 Created 8 users:`);
    console.log(`   - 1 Project Manager: ${johnDoe.name}`);
    console.log(`   - 2 Developers: ${sarahWilson.name}, ${davidLee.name}`);
    console.log(`   - 2 Designers: ${mikeJohnson.name}, ${mariaGarcia.name}`);
    console.log(`   - 1 QA Tester: ${emilyDavis.name}`);
    console.log(`   - 1 Team Lead: ${alexChen.name}`);
    console.log(`   - 1 Mobile Lead: ${jessicaBrown.name}`);
    console.log(`🏢 Created 5 teams:`);
    console.log(`   - Frontend Development Team`);
    console.log(`   - Quality Assurance Team`);
    console.log(`   - Mobile Development Team`);
    console.log(`   - Design Team`);
    console.log(`   - Backend Engineering Team`);
    console.log(`📋 Created 4 projects:`);
    console.log(`   - Company Website Redesign (Active, High Priority)`);
    console.log(`   - RANWIP Mobile Application (Active, High Priority)`);
    console.log(`   - API Architecture Refactor (Active, Medium Priority)`);
    console.log(`   - Brand Identity Refresh (Active, Low Priority)`);
    console.log(`✅ Created 16 tasks across all projects with realistic dependencies`);
    console.log('\n🚀 You can now start using the API with realistic sample data!');
    console.log('\n📚 Try these endpoints:');
    console.log(`   - GET /users - View all users`);
    console.log(`   - GET /projects - View all projects`);
    console.log(`   - GET /tasks - View all tasks`);
    console.log(`   - GET /teams - View all teams`);
    console.log(`   - GET /api - Swagger documentation`);
    
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    if (error.message) {
      console.error('Error message:', error.message);
    }
    if (error.detail) {
      console.error('Error detail:', error.detail);
    }
  } finally {
    await app.close();
  }
}

