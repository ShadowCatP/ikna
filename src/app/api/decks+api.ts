import { internalServerError, unauthorizedError } from '@/server/api';
import { getAuthenticatedUser } from '@/server/auth';
import { prisma } from '@/server/prisma';
import { z } from 'zod';

const createDeckSchema = z.object({
  title: z.string().trim().min(1).max(50),
  description: z.string().trim().max(150).optional(),
});

export async function GET(request: Request) {
  try {
    const user = await getAuthenticatedUser(request);

    if (!user) {
      return unauthorizedError();
    }

    const decks = await prisma.deck.findMany({
      where: { userId: user.id },
      select: {
        id: true,
        userId: true,
        title: true,
        description: true,
        _count: { select: { cards: true } },
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: 'desc' },
    });

    return Response.json(
      decks.map(({ _count, ...deck }) => ({
        ...deck,
        cardCount: _count.cards,
      }))
    );
  } catch {
    return internalServerError();
  }
}

export async function POST(request: Request) {
  try {
    const user = await getAuthenticatedUser(request);

    if (!user) {
      return unauthorizedError();
    }

    const body = await request.json();
    const result = createDeckSchema.safeParse(body);

    if (!result.success) {
      return Response.json(
        { error: result.error.issues[0]?.message ?? 'Invalid deck data' },
        { status: 400 }
      );
    }

    const deck = await prisma.deck.create({
      data: {
        userId: user.id,
        title: result.data.title,
        description: result.data.description || null,
      },
      select: {
        id: true,
        userId: true,
        title: true,
        description: true,
        _count: { select: { cards: true } },
        createdAt: true,
        updatedAt: true,
      },
    });

    const { _count, ...deckPreview } = deck;

    return Response.json(
      { ...deckPreview, cardCount: _count.cards },
      { status: 201 }
    );
  } catch {
    return internalServerError();
  }
}
