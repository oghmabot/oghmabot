import { BeamdogApiResponseBody } from '../../proxies';
import { calculateTimeBetween } from '../../../utils';

export interface Status {
  name: string;
  passworded: boolean;
  players: number;
  online: boolean;
  uptime: number;
  last_seen?: number;
  kx_pk: string;
}

export enum StatusDescriptor {
  Offline,
  Restarting,
  Stabilizing = Restarting,
  Online,
}

export const StatusColors: Record<string, number> = {
  online: 0x00ff00,
  offline: 0xff0000,
  restarting: 0xffcc00,
  stabilizing: 0xffcc00,
};

export class StatusModel {
  static fromBeamdogApiResponseBody = (response: BeamdogApiResponseBody): Status => (
    {
      name: response.session_name,
      passworded: response.passworded,
      players: response.current_players,
      online: true,
      uptime: calculateTimeBetween(response.first_seen, response.last_advertisement),
      last_seen: response.last_advertisement,
      kx_pk: response.kx_pk,
    }
  );

  static resolveStatusAsDescriptor = (status: Status): StatusDescriptor => {
    if (status.online) {
      return status.passworded ? StatusDescriptor.Restarting : StatusDescriptor.Online;
    }

    return StatusDescriptor.Offline;
  }
}
