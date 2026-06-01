import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const categories = await prisma.category.findMany({
    orderBy: { order: 'asc' },
    select: { slug: true, name: true },
  })

  return NextResponse.json(categories)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const name = typeof body.name === 'string' ? body.name.trim() : ''
  const icon = typeof body.icon === 'string' ? body.icon.trim() : 'ti-tag'

  if (!name) {
    return NextResponse.json({ error: 'name is required' }, { status: 400 })
  }

  // Generate a slug from the name (lowercase, hyphens, no special chars).
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

  const existing = await prisma.category.findUnique({ where: { slug } })
  if (existing) {
    return NextResponse.json({ error: 'A category with that name already exists' }, { status: 409 })
  }

  // Place the new category after the last existing one.
  const lastCategory = await prisma.category.findFirst({ orderBy: { order: 'desc' } })
  const order = (lastCategory?.order ?? 0) + 1

  const category = await prisma.category.create({
    data: { name, slug, icon, order },
  })

  // Bust browse and home pages so the new category appears immediately.
  revalidatePath('/')
  revalidatePath('/browse', 'layout')

  return NextResponse.json(category, { status: 201 })
}
