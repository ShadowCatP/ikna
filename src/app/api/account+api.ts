import { internalServerError, unauthorizedError } from '@/server/api';
import { getAuthenticatedUser } from '@/server/auth';
import { prisma } from '@/server/prisma';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: Request) {
  try {
    const user = await getAuthenticatedUser(request);

    if (!user) {
      return unauthorizedError();
    }

    const profile = await prisma.userProfile.findUnique({
      where: { id: user.id },
      select: { allowDevTools: true },
    });

    return Response.json({ allowDevTools: profile?.allowDevTools ?? false });
  } catch {
    return internalServerError();
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await getAuthenticatedUser(request);

    if (!user) {
      return unauthorizedError();
    }

    const secretKey = process.env.SUPABASE_SECRET_KEY;
    if (!secretKey) {
      return internalServerError();
    }

    const supabaseAdmin = createClient(
      process.env.EXPO_PUBLIC_SUPABASE_URL!,
      secretKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
          detectSessionInUrl: false,
        },
      }
    );

    const { error } = await supabaseAdmin.auth.admin.deleteUser(user.id);
    if (error) {
      return internalServerError();
    }

    await prisma.userProfile.deleteMany({ where: { id: user.id } });

    return Response.json({ success: true });
  } catch {
    return internalServerError();
  }
}
