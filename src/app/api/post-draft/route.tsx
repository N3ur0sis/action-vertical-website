import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function PUT(request: Request) {
  try {
    const { id, isPublished } = await request.json()

    if (!id) {
      return NextResponse.json({ error: 'Post ID is required' }, { status: 400 })
    }

    const postId = parseInt(id, 10)
    if (isNaN(postId)) {
      return NextResponse.json({ error: 'Invalid Post ID' }, { status: 400 })
    }

    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: { 
        isPublished, 
        updatedAt: new Date() 
      },
    })

    return NextResponse.json(updatedPost)
  } catch (error) {
    console.error('Error updating post:', error)
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 })
  }
}
