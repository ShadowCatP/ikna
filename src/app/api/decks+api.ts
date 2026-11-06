import { internalServerError, unauthorizedError } from '@/server/api';
import { getAuthenticatedUser } from '@/server/auth';
import { prisma } from '@/server/prisma';

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
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: 'desc' },
    });

    return Response.json(decks);
  } catch {
    return internalServerError();
  }
}
