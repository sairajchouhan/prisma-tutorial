import { PrismaClient } from '@prisma/client'
import faker from 'faker'
const prisma = new PrismaClient()

const seed = async () => {
  await prisma.post.deleteMany()
  await prisma.user.deleteMany()
  const userPromises: Array<Promise<any>> = []
  for (let i = 0; i < 20; i++) {
    userPromises.push(
      prisma.user.create({
        data: {
          name: faker.name.findName(),
          email: faker.internet.email(),
        },
      })
    )
  }
  const users = await Promise.all(userPromises)
  const userIds = users.map((user) => user.id)
  const getRamdomUserId = () => {
    return userIds[Math.floor(Math.random() * userIds.length)]
  }
  console.log(userIds)
  console.log(getRamdomUserId())
  const postPromises: Array<Promise<any>> = []
  for (let i = 0; i < 30; i++) {
    postPromises.push(
      prisma.post.create({
        data: {
          title: faker.lorem.sentence(),
          content: faker.lorem.paragraphs(),
          authorId: getRamdomUserId(),
        },
      })
    )
  }
  const posts = await Promise.all(postPromises)
  console.log(users)
  console.log(posts)
}

seed()
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
