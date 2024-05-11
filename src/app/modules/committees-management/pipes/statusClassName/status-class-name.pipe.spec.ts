import { StatusClassNamePipe } from './status-class-name.pipe';

describe('StatusClassNamePipe', () => {
  it('create an instance', () => {
    const pipe = new StatusClassNamePipe();
    expect(pipe).toBeTruthy();
  });
});
