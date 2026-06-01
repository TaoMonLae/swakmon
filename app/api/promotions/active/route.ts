import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Returns promotions that are active right now and match the optional
// tier / category / state filters (where 'all' acts as a wildcard).
export async function GET(req: NextRequest) {
    const { searchParams } = req.nextUrl
    const tier = searchParams.get('tier')
    const categoryId = searchParams.get('categoryId')
    const stateId = searchParams.get('stateId')

    const now = new Date()

    const activePromotions = await prisma.promotion.findMany({
        where: {
            isActive: true,
            validFrom: { lte: now },
            validUntil: { gte: now },
            ...(tier && { appliesToTier: { in: ['all', tier] } }),
            ...(categoryId && { appliesToCategory: { in: ['all', categoryId] } }),
            ...(stateId && { appliesToState: { in: ['all', stateId] } }),
        },
        orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(activePromotions)
}
