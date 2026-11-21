import { internalServerError, unauthorizedError } from '@/server/api';
import { getAuthenticatedUser } from '@/server/auth';
import { prisma } from '@/server/prisma';
import { z } from 'zod';

const createCardSchema = z.object({
  id: z.uuid(),
  deckId: z.uuid(),
  frontContent: z.string().trim().min(1).max(150),
  backContent: z.string().trim().min(1).max(300),
});

export async function POST(request: Request) {
  try {
    const user = await getAuthenticatedUser(request);

    if (!user) {
      return unauthorizedError();
    }

    const result = createCardSchema.safeParse(await request.json());

    if (!result.success) {
      return Response.json(
        { error: result.error.issues[0]?.message ?? 'Invalid card data' },
        { status: 400 }
      );
    }

    const deck = await prisma.deck.findFirst({
      where: {
        id: result.data.deckId,
        userId: user.id,
      },
      select: { id: true },
    });

    if (!deck) {
      return Response.json({ error: 'Deck not found' }, { status: 404 });
    }

    const existingCard = await prisma.card.findUnique({
      where: { id: result.data.id },
      select: { deckId: true },
    });

    if (existingCard && existingCard.deckId !== deck.id) {
      return Response.json(
        { error: 'Card already belongs to another deck' },
        { status: 409 }
      );
    }

    const card = await prisma.card.upsert({
      where: { id: result.data.id },
      create: {
        id: result.data.id,
        deckId: deck.id,
        frontContent: result.data.frontContent,
        backContent: result.data.backContent,
      },
      update: {
        frontContent: result.data.frontContent,
        backContent: result.data.backContent,
      },
      select: {
        id: true,
        deckId: true,
        frontContent: true,
        backContent: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return Response.json(card, { status: 201 });
  } catch {
    return internalServerError();
  }
}
