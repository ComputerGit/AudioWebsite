function parseExpiration(expiration) {
  const timeUnit = expiration.slice(-1);
  const timeValue = parseInt(expiration.slice(0, -1), 10);

  if (isNaN(timeValue)) {
    throw new Error("Invalid Expiration Time Value");
  }

  switch (timeUnit) {
    case "d": // days
      return timeValue * 24 * 60 * 60 * 1000;
    case "h": // hours
      return timeValue * 60 * 60 * 1000;
    case "m": // minutes
      return timeValue * 60 * 1000;
    case "s": // seconds
      return timeValue * 1000;
    default:
      throw new Error("Invalid Expiration Time Unit");
  }
}

module.exports = parseExpiration;
