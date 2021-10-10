import { Request, Response } from 'express';

import { OghmabotClient } from '../../oghmabot.client';

export const handleGetStatus = async (
  client: OghmabotClient,
  request: Request,
  response: Response,
): Promise<Response> => {
  const { params: { id } } = request;
  const statusCache = client.pollers.get('status')?.cache;

  return response.send(
    id
      ? statusCache?.get(id)
      : statusCache,
  );
};
