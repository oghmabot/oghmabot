import { serverStatusToEmbed, serverStatusToStatusUpdateEmbed } from './formatting';
import { hourMs, hourUnixTime, nowUnixTime } from './time';

describe('formatting', ()  => {
  const mockServer = {
    id: '',
    name: 'Awesome Server',
    ip: '123.45.678.90',
    port: 1337,
    href: 'http://example.com',
    img: 'http://example.com/banner.png',
  };

  const mockStatusOnline = {
    name: mockServer.name,
    passworded: false,
    players: 100,
    online: true,
    uptime: hourMs,
    serverId: mockServer.id,
  };

  const mockStatusStabilizing = {
    name: mockServer.name,
    passworded: true,
    players: 0,
    online: true,
    uptime: hourMs,
    serverId: mockServer.id,
  };

  const mockStatusOffline = {
    name: mockServer.name,
    passworded: false,
    players: 0,
    online: false,
    uptime: 0,
    lastSeen: nowUnixTime() - hourUnixTime,
    serverId: mockServer.id,
  };

  describe('serverStatusToEmbed', () => {
    it.each([
      [
        mockServer,
        mockStatusOnline,
        {
          title: mockServer.name,
          color: 0x00ff00,
          description: `**Online** :hourglass: 01:00:00 :busts_in_silhouette: ${mockStatusOnline.players}`,
          thumbnail: mockServer.img,
          url: mockServer.href,
        },
      ],
      [
        mockServer,
        mockStatusStabilizing,
        {
          title: mockServer.name,
          color: 0xffcc00,
          description: `**Stabilizing** :hourglass: 01:00:00 :busts_in_silhouette: ${mockStatusStabilizing.players}`,
          thumbnail: mockServer.img,
          url: mockServer.href,
        },
      ],
      [
        mockServer,
        mockStatusOffline,
        {
          title: mockServer.name,
          color: 0xff0000,
          description: `**Offline** :hourglass: 01:00:00`,
          thumbnail: mockServer.img,
          url: mockServer.href,
        },
      ],
    ])('should return embed with expected fields', (server, status, expected) => {
      const { title, color, description, thumbnail, url } = serverStatusToEmbed(server, status);
      expect(title).toEqual(expected.title);
      expect(color).toEqual(expected.color);
      expect(description).toEqual(expected.description);
      expect(thumbnail?.url).toEqual(expected.thumbnail);
      expect(url).toEqual(expected.url);
    });
  });

  describe('serverStatusToStatusUpdateEmbed', () => {
    it.each([
      [
        mockServer,
        mockStatusOnline,
        {
          title: `${mockServer.name} is now online.`,
          color: 0x00ff00,
          thumbnail: mockServer.img,
        },
      ],
      [
        mockServer,
        mockStatusStabilizing,
        {
          title: `${mockServer.name} is now restarting.`,
          color: 0xffcc00,
          thumbnail: mockServer.img,
        },
      ],
      [
        mockServer,
        mockStatusOffline,
        {
          title: `${mockServer.name} is now offline.`,
          color: 0xff0000,
          thumbnail: mockServer.img,
        },
      ],
    ])('should return embed with expected fields', (server, status, expected) => {
      const { title, color, thumbnail } = serverStatusToStatusUpdateEmbed(server, status);
      expect(title).toEqual(expected.title);
      expect(color).toEqual(expected.color);
      expect(thumbnail?.url).toEqual(expected.thumbnail);
    });
  });
});
