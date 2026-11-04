export async function GET() {
  return Response.json([
    {
      id: 'deck-spanish-a1',
      userId: 'mock-user',
      title: 'Spanish A1',
      createdAt: '2026-10-01T09:00:00.000Z',
      updatedAt: '2026-11-04T08:30:00.000Z',
      cardCount: 25,
      dueCount: 12,
      accent: 'lavender',
    },
    {
      id: 'deck-polish-basics',
      userId: 'mock-user',
      title: 'Polish basics',
      createdAt: '2026-10-03T09:00:00.000Z',
      updatedAt: '2026-11-04T08:20:00.000Z',
      cardCount: 15,
      dueCount: 6,
      accent: 'pink',
    },
    {
      id: 'deck-mobile-ux',
      userId: 'mock-user',
      title: 'Mobile UX terms',
      createdAt: '2026-10-05T09:00:00.000Z',
      updatedAt: '2026-11-04T08:10:00.000Z',
      cardCount: 10,
      dueCount: 0,
      accent: 'green',
    },
  ]);
}
