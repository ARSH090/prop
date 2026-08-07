import { db } from '@/lib/firebase/admin'
import { NextRequest, NextResponse } from 'next/server'
import { FieldValue } from 'firebase-admin/firestore'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { user_id, voteType } = body // voteType: 'up' | 'down'

    if (!user_id || !voteType) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 })
    }

    const postRef = db.collection('community_posts').doc(id)
    const postSnap = await postRef.get()

    if (!postSnap.exists) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    const data = postSnap.data() || {}
    let upvotedBy: string[] = data.upvoted_by || []
    let downvotedBy: string[] = data.downvoted_by || []

    if (voteType === 'up') {
      if (upvotedBy.includes(user_id)) {
        // Toggle off
        upvotedBy = upvotedBy.filter(uid => uid !== user_id)
      } else {
        // Toggle on up, off down
        upvotedBy.push(user_id)
        downvotedBy = downvotedBy.filter(uid => uid !== user_id)
      }
    } else if (voteType === 'down') {
      if (downvotedBy.includes(user_id)) {
        // Toggle off
        downvotedBy = downvotedBy.filter(uid => uid !== user_id)
      } else {
        // Toggle on down, off up
        downvotedBy.push(user_id)
        upvotedBy = upvotedBy.filter(uid => uid !== user_id)
      }
    }

    await postRef.update({
      upvoted_by: upvotedBy,
      downvoted_by: downvotedBy,
      upvotes: upvotedBy.length,
      downvotes: downvotedBy.length,
      updated_at: FieldValue.serverTimestamp(),
    })

    return NextResponse.json({
      success: true,
      upvotes: upvotedBy.length,
      downvotes: downvotedBy.length,
      upvoted_by: upvotedBy,
      downvoted_by: downvotedBy,
    })
  } catch (error) {
    console.error('Error voting on community post:', error)
    return NextResponse.json({ error: 'Failed to process vote' }, { status: 500 })
  }
}
