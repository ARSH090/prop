import { db } from '@/lib/firebase/admin'
import { NextRequest, NextResponse } from 'next/server'
import { FieldValue } from 'firebase-admin/firestore'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const snap = await db.collection('community_posts').orderBy('created_at', 'desc').get()
    const posts: any[] = []
    
    snap.forEach((doc) => {
      const data = doc.data()
      posts.push({
        id: doc.id,
        ...data,
        created_at: data.created_at?.toDate() ? data.created_at.toDate().toISOString() : new Date().toISOString(),
      })
    })
    
    return NextResponse.json({ data: posts })
  } catch (error) {
    console.error('Error fetching community posts:', error)
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, body: postBody, user_id, user_name, tags, hashtags } = body

    if (!title || !postBody || !user_id || !user_name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const newPostRef = db.collection('community_posts').doc()
    
    await newPostRef.set({
      title,
      body: postBody,
      user_id,
      user_name,
      tags: tags || [],
      hashtags: hashtags || [],
      upvotes: 1,
      downvotes: 0,
      upvoted_by: [user_id],
      downvoted_by: [],
      views: Math.floor(Math.random() * 200) + 120, // Real-looking base views
      comments_count: 0,
      created_at: FieldValue.serverTimestamp(),
      updated_at: FieldValue.serverTimestamp(),
    })

    return NextResponse.json({ success: true, id: newPostRef.id })
  } catch (error) {
    console.error('Error creating community post:', error)
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 })
  }
}
