class TimeUtils {
  static convertLifespanToMilliseconds(lifespan: string | number) {
    const match = String(lifespan).match(/^(\d+)([smhd]?)$/);
    if (!match) {
      throw new Error('Invalid lifespan format');
    }

    const value = parseInt(match[1]);
    const unit = match[2];

    switch (unit) {
      case 's':
        return value * 1000;
      case 'm':
        return value * 60 * 1000;
      case 'h':
        return value * 60 * 60 * 1000;
      case 'd':
        return value * 24 * 60 * 60 * 1000;
      default:
        return value;
    }
  }
}

export default TimeUtils;
