import { serverStatusToEmbed } from './formatting';
import { hourMs, hourUnixTime, nowUnixTime } from './time';

describe('formatting', ()  => {
  describe('serverStatusToEmbed', () => {
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
      kx_pk: mockServer.id,
    };

    const mockStatusOffline = {
      name: mockServer.name,
      passworded: false,
      players: 0,
      online: false,
      uptime: 0,
      last_seen: nowUnixTime() - hourUnixTime,
      kx_pk: mockServer.id,
    };

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
        mockStatusOffline,
        {
          title: mockServer.name,
          color: 0xffcc00,
          description: `**Offline** :disappointed: 01:00:00`,
          thumbnail: mockServer.img,
          url: mockServer.href,
        },
      ],
    ])('should return embed with expected fields', (server, status, expectedFields) => {
      const embed = serverStatusToEmbed(server, status);
      const { title, color, description, thumbnail, url } = expectedFields;
      expect(embed.title).toEqual(title);
      expect(embed.color).toEqual(color);
      expect(embed.description).toEqual(description);
      expect(embed.thumbnail?.url).toEqual(thumbnail);
      expect(embed.url).toEqual(url);

      // 1611010334
      // 1611011560062
    });
  });
});
