const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs'); // If not installed: npm install bcryptjs
const prisma = new PrismaClient();

async function main() {
  // Create a test user first (assuming no users exist)
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('testpassword', salt); // Replace with real password

  const user = await prisma.user.create({
    data: {
      username: 'testauthor',
      email: 'author@example.com',
      password: hashedPassword,
      role: 'admin'
    }
  });
  console.log(`Created user with id: ${user.id}`);

  // Now create posts with flat authorId
  await prisma.post.createMany({
    data: [
      {
        title: "My first post",
        content: "This is my first post",
        published: true,
        authorId: user.id // Flat reference to the user we just created
      },
      {
        title: "My second post",
        content: "This is my second post",
        published: true,
        authorId: user.id
      }
    ]
  });
  console.log('Posts created successfully');

  // Optional: Add a comment to test relations
  await prisma.comment.create({
    data: {
      content: "Great first post!",
      username: "anon",
      post: { connect: { id: 1 } } // Assumes first post id=1; adjust if needed
    }
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });