import { db } from '@/lib/firebase/admin'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const firmId = searchParams.get('firm_id')
    const blogPostId = searchParams.get('blog_post_id')

    let query: any = db.collection('comments').where('status', '==', 'visible')

    if (firmId) {
      query = query.where('firm_id', '==', firmId)
    } else if (blogPostId) {
      query = query.where('blog_post_id', '==', blogPostId)
    } else {
      query = query.where('firm_id', '==', null).where('blog_post_id', '==', null)
    }

    const snapshot = await query.get()
    const comments: any[] = []
    snapshot.forEach((doc: any) => {
      comments.push({ id: doc.id, ...doc.data() })
    })

    // Sort client-side or server-side (server-side orderBy requires index setup, client-side is safer for new tables)
    comments.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())

    return NextResponse.json({ data: comments })
  } catch (error) {
    console.error('Error fetching comments:', error)
    return NextResponse.json({ data: [] })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { firm_id, blog_post_id, user_id, user_name, body: commentBody } = body

    if (!user_id || !commentBody) {
      return NextResponse.json({ error: 'User ID and comment body are required' }, { status: 400 })
    }

    const docRef = await db.collection('comments').add({
      firm_id: firm_id || null,
      blog_post_id: blog_post_id || null,
      user_id,
      user_name: user_name || 'Anonymous',
      body: commentBody,
      status: 'visible',
      created_at: new Date().toISOString()
    })

    return NextResponse.json({ success: true, id: docRef.id })
  } catch (error) {
    console.error('Error adding comment:', error)
    return NextResponse.json({ error: 'Failed to add comment' }, { status: 500 })
  }
}
