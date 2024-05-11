import { VotesCountPipe } from './votes-count.pipe';

describe('VotesCountPipe', () => {
  it('create an instance', () => {
    const pipe = new VotesCountPipe();
    expect(pipe).toBeTruthy();
  });
});
