
const shortUrlService = require('../routes/shorturl-service');

test('12345 = 3d7', () => {
    expect(shortUrlService.fromDecimalToHex(12345)).toBe("3d7");
});
