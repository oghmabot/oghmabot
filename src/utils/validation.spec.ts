import { isValidURL, isValidIPAndPort } from './validation';

describe('validation', () => {
  describe('isValidURL', () => {
    it.each([
      'https://api.nwn.beamdog.net/v1/servers/',
      'http://portal.arelith.com/',
      'https://portal.nwnarelith.com/images/planes_header.jpg',
      'http://google.com',
    ])('should be valid', url => expect(isValidURL(url)).toBe(true));

    it.each([
      'wow',
      'ØØØLQZgSaPrWtKs?+zCwtLDdsbiawWADhKhxLDSanbivD',
      'htps://api.nwn.beamdog.net/v1/servers/',
      'https:/api.nwn.beamdog.net/v1/servers/',
    ])('should not be valid', url => expect(isValidURL(url)).toBe(false));
  });

  describe('isValidIPAndPort', () => {
    it.each([
      '145.239.204.29:5122',
    ])('should be valid', addr => expect(isValidIPAndPort(addr)).toBe(true));

    it.each([
      'wow',
      'ØØØLQZgSaPrWtKs?+zCwtLDdsbiawWADhKhxLDSanbivD',
      '145.239.204.29:999999',
      '1342.239.204.29:5123',
      '145.239.204.29',
      '5123',
    ])('should not be valid', addr => expect(isValidIPAndPort(addr)).toBe(false));
  });
});
