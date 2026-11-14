import { internalServerError, unauthorizedError } from '@/server/api';
import { getAuthenticatedUser } from '@/server/auth';
import { prisma } from '@/server/prisma';

export async function DELETE(request: Request, { id }: { id: string }) {
  try {
    const user = await getAuthenticatedUser(request);

    if (!user) {
      return unauthorizedError();
    }

    const card = await prisma.card.findFirst({
      where: {
        id,
        deck: { userId: user.id },
      },
      select: { id: true },
    });

    if (!card) {
      return Response.json({ error: 'Card not found' }, { status: 404 });
    }

    await prisma.card.delete({ where: { id: card.id } });

    return Response.json({ success: true });
  } catch {
    return internalServerError();
  }
}
