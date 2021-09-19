import express from 'express'
import { PrismaClient } from '@prisma/client'
const app = express()

const prisma = new PrismaClient()

app.use(express.json())

app.get('/', async (_req, res) => {
  const users = await prisma.user.findMany()
  res.json({ users })
})

app.post('/user', async (req, res) => {
  const { name, email } = req.body
  try {
    const user = await prisma.user.create({
      data: {
        email,
        name,
      },
    })
    res.json({ user })
  } catch (err) {
    console.log(err)
    res.json({ error: err.message })
  }
})

app.put('/user/:id', async (req, res) => {
  const { email, name }: { email: string; name: string } = req.body
  const id = parseInt(req.params.id)
  const data: any = {}
  if (email && email.trim() !== '') {
    data.email = email
  }
  if (name && name.trim() !== '') {
    data.name = name
  }

  const user = await prisma.user.update({
    where: {
      id: id,
    },
    data: { ...data },
  })
  res.json({ updatedUser: user })
})

app.delete('/user/:id', async (req, res) => {
  const id = parseInt(req.params.id)
  const user = await prisma.user.findUnique({
    where: { id },
  })
  if (!user) {
    return res.status(404).send('User not found')
  }
  await prisma.user.delete({
    where: { id },
  })
  return res.json({ userDeleted: true })
})

app.post('/post', async (req, res) => {
  const { authorId, title, content } = req.body

  const post = await prisma.post.create({
    data: {
      title,
      content,
      authorId: parseInt(authorId),
    },
  })
  res.json({ post })
})

app.get('/post', async (_req, res) => {
  //! 1
  // const posts = await prisma.post.findMany({
  //   include: {
  //     author: true,
  //   },
  // })
  //! 2
  // const posts = await prisma.post.findMany({
  //   include: {
  //     author: {
  //       select: {
  //         email: true,
  //         name: true,
  //       },
  //     },
  //   },
  // })
  //! 3
  // const posts = await prisma.post.findMany({
  //   include: {
  //     author: {
  //       select: {
  //         email: true,
  //         name: true,
  //       },
  //     },
  //   },
  //   where: {
  //     authorId: 13,
  //   },
  // })
  //! 4
  // const posts = await prisma.post.findMany({
  //   include: {
  //     author: {
  //       select: {
  //         email: true,
  //         name: true,
  //       },
  //     },
  //   },
  //   where: {
  //     authorId: {
  //       gt: 10,
  //     },
  //   },
  // })
  //! 5
  // const posts = await prisma.post.findMany({
  //   include: {
  //     author: {
  //       select: {
  //         email: true,
  //         name: true,
  //       },
  //     },
  //   },
  //   where: {
  //     authorId: {
  //       gt: 10,
  //     },
  //     title: {
  //       contains: 'Omnis',
  //     },
  //   },
  // })
  //! 6
  // const posts = await prisma.post.findMany({
  //   include: {
  //     author: {
  //       select: {
  //         email: true,
  //         name: true,
  //       },
  //     },
  //   },
  //   orderBy: {
  //     createdAt: 'desc',
  //   },
  // })
  //! 7
  // const posts = await prisma.post.findMany({
  //   include: {
  //     author: {
  //       select: {
  //         email: true,
  //         name: true,
  //       },
  //     },
  //   },
  //   orderBy: {
  //     createdAt: 'desc',
  //   },
  //   skip: 1,
  //   take: 10,
  // })

  res.json({ posts: [] })
})

const port = 5000
app.listen(port, () => {
  console.log('Listening on port ' + port)
})
