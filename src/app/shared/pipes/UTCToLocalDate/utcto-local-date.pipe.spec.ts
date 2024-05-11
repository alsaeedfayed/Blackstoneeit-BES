import { UTCToLocalDatePipe } from './utcto-local-date.pipe';

describe('UTCToLocalDatePipe', () => {
  it('create an instance', () => {
    const pipe = new UTCToLocalDatePipe();
    expect(pipe).toBeTruthy();
  });
});
