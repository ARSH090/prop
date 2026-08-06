import { db } from '@/lib/firebase/admin'
import { NextRequest, NextResponse } from 'next/server'
import { FieldValue, Timestamp } from 'firebase-admin/firestore'

export async function GET() {
  try {
    const snapshot = await db.collection('blog_posts').orderBy('created_at', 'desc').get()
    const posts: any[] = []
    snapshot.forEach((doc: any) => {
      posts.push({ id: doc.id, ...doc.data() })
    })
    return NextResponse.json({ data: posts })
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    // Return mock data as fallback
    return NextResponse.json({
      data: [
        {
          id: 'blog-prop-2026',
          slug: 'best-prop-firms-2026',
          title: 'Best Prop Firms in 2026: Complete Guide',
          excerpt: 'Discover the top prop firms for forex and futures trading in 2026.',
          content_md: '# Best Prop Firms in 2026\n\nProp trading has exploded in popularity...',
          cover_image_url: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&auto=format&fit=crop',
          author_id: 'admin',
          published: true,
          published_at: new Date().toISOString(),
        },
      ],
    })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, slug, excerpt, content_md, cover_image_url, published, tags, category } = body

    if (!title || !slug) {
      return NextResponse.json({ error: 'Title and slug are required' }, { status: 400 })
    }

    // Check for duplicate slug
    const existing = await db.collection('blog_posts').where('slug', '==', slug).get()
    if (!existing.empty) {
      return NextResponse.json({ error: 'A post with this slug already exists. Please use a different slug.' }, { status: 409 })
    }

    const docId = `blog-${slug}`
    const postRef = db.collection('blog_posts').doc(docId)

    await postRef.set({
      title,
      slug,
      excerpt: excerpt || '',
      content_md: content_md || '',
      cover_image_url: cover_image_url || '',
      tags: tags || [],
      category: category || 'announcement',
      author_id: 'admin',
      published: !!published,
      published_at: published ? FieldValue.serverTimestamp() : null,
      created_at: FieldValue.serverTimestamp(),
      updated_at: FieldValue.serverTimestamp(),
    })

    return NextResponse.json({ success: true, id: docId })
  } catch (error) {
    console.error('Error creating blog post:', error)
    return NextResponse.json({ error: 'Failed to create blog post' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json({ error: 'Post ID is required' }, { status: 400 })
    }

    const updateData: any = {
      ...updates,
      updated_at: FieldValue.serverTimestamp(),
    }

    // If toggling to published, set published_at timestamp
    if (updates.published === true) {
      updateData.published_at = FieldValue.serverTimestamp()
    }

    await db.collection('blog_posts').doc(id).update(updateData)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating blog post:', error)
    return NextResponse.json({ error: 'Failed to update blog post' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Post ID is required' }, { status: 400 })
    }

    await db.collection('blog_posts').doc(id).delete()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting blog post:', error)
    return NextResponse.json({ error: 'Failed to delete blog post' }, { status: 500 })
  }
}
