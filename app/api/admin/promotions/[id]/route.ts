import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { Prisma } from '@prisma/client'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    let body: Record<string, unknown>
    try {
        body = await req.json()
    } catch {
        return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
    }

    // Whitelist updatable fields.
    const data: Prisma.PromotionUpdateInput = {}
    if (typeof body.name === 'string') data.name = body.name
    if (body.discountType === 'PERCENTAGE' || body.discountType === 'FIXED_MMK') {
        data.discountType = body.discountType
    }
    if (body.discountValue !== undefined && Number.isFinite(Number(body.discountValue))) {
        data.discountValue = Number(body.discountValue)
    }
    if (typeof body.appliesToTier === 'string') data.appliesToTier = body.appliesToTier
    if (typeof body.appliesToCategory === 'string') data.appliesToCategory = body.appliesToCategory
    if (typeof body.appliesToState === 'string') data.appliesToState = body.appliesToState
    if (body.validFrom) {
        const d = new Date(String(body.validFrom))
        if (!isNaN(d.getTime())) data.validFrom = d
    }
    if (body.validUntil) {
        const d = new Date(String(body.validUntil))
        if (!isNaN(d.getTime())) data.validUntil = d
    }
    if (typeof body.isActive === 'boolean') data.isActive = body.isActive

    try {
        const promo = await prisma.promotion.update({ where: { id: params.id }, data })
        return NextResponse.json(promo)
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
            return NextResponse.json({ error: 'Not found' }, { status: 404 })
        }
        throw e
    }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    try {
        await prisma.promotion.delete({ where: { id: params.id } })
        return NextResponse.json({ ok: true })
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
            return NextResponse.json({ error: 'Not found' }, { status: 404 })
        }
        throw e
    }
}
