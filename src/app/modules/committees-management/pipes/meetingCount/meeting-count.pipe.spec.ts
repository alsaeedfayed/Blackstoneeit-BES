import { MeetingCountPipe } from './meeting-count.pipe';

describe('MeetingCountPipe', () => {
  it('create an instance', () => {
    const pipe = new MeetingCountPipe();
    expect(pipe).toBeTruthy();
  });
});
