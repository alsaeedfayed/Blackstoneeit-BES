import { VotersCountPipe } from './voters-count.pipe';

describe('VotersCountPipe', () => {
  it('create an instance', () => {
    const pipe = new VotersCountPipe();
    expect(pipe).toBeTruthy();
  });
});
