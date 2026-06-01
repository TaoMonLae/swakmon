import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { uploadToCloudinary } from '@/lib/cloudinary'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE = 5 * 1024 * 1024 // 5MB

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await req.formData()
  const file = formData.get('file') as File | null

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  // Validate file type
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: 'Invalid file type. Accepted: jpg, png, webp' },
      { status: 400 }
    )
  }

  // Validate file size
  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: 'File too large. Maximum size: 5MB' },
      { status: 400 }
    )
  }

  // Convert to Buffer and upload
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  try {
    const { url, publicId } = await uploadToCloudinary(buffer)
    return NextResponse.json({ url, publicId })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Upload failed'
    console.error('[upload]', message)
    return NextResponse.json({ error: 'Image upload failed. Check Cloudinary credentials.' }, { status: 502 })
  }
}
