import { getAuthenticatedUser } from '../../server/auth';
import { prisma } from '../../server/prisma';

export async function GET(request: Request) {
  const user = await getAuthenticatedUser(request);

  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
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
}
