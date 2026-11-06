export function apiError(message: string, status: number) {
  return Response.json({ error: message }, { status });
}

export function unauthorizedError() {
  return apiError('Unauthorized', 401);
}

export function internalServerError() {
  return apiError('Internal server error', 500);
}
