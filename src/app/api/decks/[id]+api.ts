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
      where: {
        id,
        userId: user.id,
      },
      select: {
        id: true,
        userId: true,
        title: true,
        description: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!deck) {
      return Response.json({ error: 'Deck not found' }, { status: 404 });
    }

    return Response.json(deck);
  } catch {
    return internalServerError();
  }
}
