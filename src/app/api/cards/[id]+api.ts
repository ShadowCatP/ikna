import { internalServerError, unauthorizedError } from '@/server/api';
import { getAuthenticatedUser } from '@/server/auth';
import { prisma } from '@/server/prisma';
import { z } from 'zod';

const updateCardSchema = z.object({
  frontContent: z.string().trim().min(1).max(150),
  backContent: z.string().trim().min(1).max(300),
});

export async function GET(request: Request, { id }: { id: string }) {
  try {
    const user = await getAuthenticatedUser(request);

    if (!user) {
      return unauthorizedError();
    }

    const card = await prisma.card.findFirst({
      where: { id, deck: { userId: user.id } },
      select: {
        id: true,
        deckId: true,
        frontContent: true,
        backContent: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!card) {
      return Response.json({ error: 'Card not found' }, { status: 404 });
    }

    return Response.json(card);
  } catch {
    return internalServerError();
  }
}

export async function PATCH(request: Request, { id }: { id: string }) {
  try {
    const user = await getAuthenticatedUser(request);

    if (!user) {
      return unauthorizedError();
    }

    const existingCard = await prisma.card.findFirst({
      where: { id, deck: { userId: user.id } },
      select: { id: true },
    });

    if (!existingCard) {
      return Response.json({ error: 'Card not found' }, { status: 404 });
    }

    const result = updateCardSchema.safeParse(await request.json());

    if (!result.success) {
      return Response.json(
        { error: result.error.issues[0]?.message ?? 'Invalid card data' },
        { status: 400 }
      );
    }

    const card = await prisma.card.update({
      where: { id: existingCard.id },
      data: result.data,
      select: {
        id: true,
        deckId: true,
        frontContent: true,
        backContent: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return Response.json(card);
  } catch {
    return internalServerError();
  }
}

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
