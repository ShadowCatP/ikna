import {
  forbiddenError,
  internalServerError,
  unauthorizedError,
} from '@/server/api';
import { getAuthenticatedUser } from '@/server/auth';
import { prisma } from '@/server/prisma';
import { z } from 'zod';

const updateDueDateSchema = z.object({
  minutes: z.number().int().min(1).max(1440),
});

export async function POST(request: Request) {
  try {
    const user = await getAuthenticatedUser(request);

    if (!user) {
      return unauthorizedError();
    }

    const profile = await prisma.userProfile.findUnique({
      where: { id: user.id },
      select: { allowDevTools: true },
    });

    if (!profile?.allowDevTools) {
      return forbiddenError();
    }

    const result = updateDueDateSchema.safeParse(await request.json());

    if (!result.success) {
      return Response.json(
        { error: result.error.issues[0]?.message ?? 'Invalid duration' },
        { status: 400 }
      );
    }

    const dueDate = new Date(Date.now() + result.data.minutes * 60_000);

    const updatedCount = await prisma.$transaction(async (transaction) => {
      const cards = await transaction.card.findMany({
        where: { deck: { userId: user.id } },
        select: {
          id: true,
          reviewState: { select: { cardId: true } },
        },
      });
      const cardIds = cards.map(({ id }) => id);
      const cardsWithoutReviewState = cards.filter(
        ({ reviewState }) => !reviewState
      );

      const updated = await transaction.cardReviewState.updateMany({
        where: { userId: user.id, cardId: { in: cardIds } },
        data: { dueDate },
      });

      const created = await transaction.cardReviewState.createMany({
        data: cardsWithoutReviewState.map(({ id }) => ({
          cardId: id,
          userId: user.id,
          dueDate,
        })),
      });

      return updated.count + created.count;
    });

    return Response.json({ success: true, dueDate, updatedCount });
  } catch {
    return internalServerError();
  }
}
