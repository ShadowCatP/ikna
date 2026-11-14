import { internalServerError, unauthorizedError } from '@/server/api';
import { getAuthenticatedUser } from '@/server/auth';
import { prisma } from '@/server/prisma';

export async function GET(request: Request, { id }: { id: string }) {
  try {
    const user = await getAuthenticatedUser(request);

    if (!user) {
      return unauthorizedError();
    }

    const deck = await prisma.deck.findFirst({
      where: { id, userId: user.id },
      select: { id: true },
    });

    if (!deck) {
      return Response.json({ error: 'Deck not found' }, { status: 404 });
    }

    const cards = await prisma.card.findMany({
      where: { deckId: deck.id },
      select: {
        id: true,
        deckId: true,
        frontContent: true,
        backContent: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    return Response.json(cards);
  } catch {
    return internalServerError();
  }
}
