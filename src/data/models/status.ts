import { BeamdogApiResponseBody } from '../proxy/beamdog';
import { calculateTimeBetween } from '../../utils';

export interface Status {
  name: string;
  players: number;
  online: boolean;
  uptime: number;
  last_seen?: number;
  kx_pk: string;
}

export class StatusModel {
  static fromBeamdogApiResponseBody = (response: BeamdogApiResponseBody): Status => (
    {
      name: response.session_name,
      players: response.current_players,
      online: true,
      uptime: calculateTimeBetween(response.first_seen, response.last_advertisement),
      last_seen: response.last_advertisement,
      kx_pk: response.kx_pk,
    }
  );
}
