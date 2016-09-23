import { LiveTrackerPage } from './app.po';

describe('live-tracker App', function() {
  let page: LiveTrackerPage;

  beforeEach(() => {
    page = new LiveTrackerPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
