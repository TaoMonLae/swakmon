import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { deleteFromCloudinary } from '@/lib/cloudinary'

export async function DELETE(_req: NextRequest, { params }: { params: { publicId: string } }) {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    let publicId: string
    try {
        publicId = decodeURIComponent(params.publicId)
    } catch {
        return NextResponse.json({ error: 'Invalid public ID' }, { status: 400 })
    }

    // Reject IDs that don't belong to this app's folder — prevents an admin
    // from (accidentally or maliciously) deleting arbitrary Cloudinary assets.
    if (!publicId.startsWith('swakmon/')) {
        return NextResponse.json({ error: 'Invalid public ID' }, { status: 400 })
    }

    try {
        await deleteFromCloudinary(publicId)
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Delete failed'
        console.error('[delete-image]', message)
        return NextResponse.json({ error: 'Failed to delete image from Cloudinary' }, { status: 502 })
    }

    return NextResponse.json({ success: true })
}
