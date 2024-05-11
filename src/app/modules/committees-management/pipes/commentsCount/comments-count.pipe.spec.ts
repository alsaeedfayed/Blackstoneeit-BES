import { CommentsCountPipe } from './comments-count.pipe';

describe('CommentsCountPipe', () => {
  it('create an instance', () => {
    const pipe = new CommentsCountPipe();
    expect(pipe).toBeTruthy();
  });
});
