import { internalServerError, unauthorizedError } from '@/server/api';
import { getAuthenticatedUser } from '@/server/auth';
import { prisma } from '@/server/prisma';
import { z } from 'zod';

const updateDeckSchema = z.object({
  title: z.string().trim().min(1).max(50),
  description: z.string().trim().max(150).optional(),
});

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

export async function PATCH(request: Request, { id }: { id: string }) {
  try {
    const user = await getAuthenticatedUser(request);

    if (!user) {
      return unauthorizedError();
    }

    const existingDeck = await prisma.deck.findFirst({
      where: { id, userId: user.id },
    });

    if (!existingDeck) {
      return Response.json({ error: 'Deck not found' }, { status: 404 });
    }

    const result = updateDeckSchema.safeParse(await request.json());

    if (!result.success) {
      return Response.json(
        { error: result.error.issues[0]?.message ?? 'Invalid deck data' },
        { status: 400 }
      );
    }

    const deck = await prisma.deck.update({
      where: { id },
      data: {
        title: result.data.title,
        description: result.data.description || null,
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

    return Response.json(deck);
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

    const existingDeck = await prisma.deck.findFirst({
      where: { id, userId: user.id },
      select: { id: true },
    });

    if (!existingDeck) {
      return Response.json({ error: 'Deck not found' }, { status: 404 });
    }

    await prisma.deck.delete({ where: { id: existingDeck.id } });

    return Response.json({ success: true });
  } catch {
    return internalServerError();
  }
}
