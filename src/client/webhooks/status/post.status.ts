import { Request, Response } from 'express';

import { OghmabotClient } from '../../oghmabot.client';
import { StatusPoller } from '../../pollers';

export const handlePostStatus = async (
  client: OghmabotClient,
  request: Request,
  response: Response,
): Promise<Response> => {
  try {
    const { body: { id, restartSignalled } } = request;
    const statusPoller = client.pollers.get('status') as StatusPoller;

    if (restartSignalled && statusPoller) {
      const newStatus = await statusPoller.signalRestart(id);
      return response.status(200).send(newStatus);
    }

    return response.status(400).send();
  } catch (error) {
    return response.status(500).send({
      errors: [error],
    });
  }
};
