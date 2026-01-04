import { PrismaClient, Status } from "@prisma/client";

const prisma = new PrismaClient();

const taskNames = [
  "Implement user authentication",
  "Design database schema",
  "Create API endpoints",
  "Write unit tests",
  "Setup CI/CD pipeline",
  "Refactor legacy code",
  "Update documentation",
  "Fix critical bugs",
  "Optimize database queries",
  "Deploy to production",
];

const taskDescriptions = [
  "Need to implement JWT-based authentication with refresh tokens",
  "Design a scalable database schema for the new feature",
  "Create RESTful API endpoints with proper validation",
  "Write comprehensive unit tests to ensure code quality",
  "Setup automated deployment pipeline using GitHub Actions",
  "Refactor old code to improve maintainability",
  "Update API documentation with latest changes",
  "Fix critical bugs reported by users in production",
  "Optimize slow database queries to improve performance",
  "Deploy the latest version to production environment",
];

const statuses: Status[] = [Status.PLAN, Status.DOING, Status.DONE];

async function main() {
  // Clear existing data
  await prisma.task.deleteMany();

  console.log("Seeding database...");

  // Create 10 random tasks
  for (let i = 0; i < 10; i++) {
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

    await prisma.task.create({
      data: {
        name: taskNames[i],
        description: taskDescriptions[i],
        status: randomStatus,
        position: i + 1,
      },
    });

    console.log(`Created task ${i + 1}: ${taskNames[i]}`);
  }

  console.log("Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
