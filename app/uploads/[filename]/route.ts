import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params
    // Prevent directory traversal
    const safeFilename = path.basename(filename)
    const filePath = path.join(process.cwd(), 'public', 'uploads', safeFilename)
    
    try {
      const fileBuffer = await fs.readFile(filePath)
      
      // Determine content type
      let contentType = 'application/octet-stream'
      const ext = path.extname(safeFilename).toLowerCase()
      if (ext === '.png') contentType = 'image/png'
      else if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg'
      else if (ext === '.gif') contentType = 'image/gif'
      else if (ext === '.webp') contentType = 'image/webp'
      else if (ext === '.svg') contentType = 'image/svg+xml'
      
      return new NextResponse(fileBuffer, {
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      })
    } catch {
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
