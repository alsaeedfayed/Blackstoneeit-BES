import { PermissionsCountPipe } from './permissions-count.pipe';

describe('PermissionsCountPipe', () => {
  it('create an instance', () => {
    const pipe = new PermissionsCountPipe();
    expect(pipe).toBeTruthy();
  });
});
