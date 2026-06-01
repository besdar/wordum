import {
  emotionalSupportCards,
  getRandomEmotionalSupportCard,
  shouldShowEmotionalSupportCard,
} from '../emotional-support';

describe('emotional support cards', () => {
  it('should not show a support card before enough answers', () => {
    expect(shouldShowEmotionalSupportCard(2, 0)).toBe(false);
  });

  it('should show a support card after enough answers based on chance', () => {
    expect(shouldShowEmotionalSupportCard(3, 0.34)).toBe(true);
    expect(shouldShowEmotionalSupportCard(3, 0.35)).toBe(false);
  });

  it('should select a random support card safely', () => {
    expect(getRandomEmotionalSupportCard(0)).toBe(emotionalSupportCards[0]);
    expect(getRandomEmotionalSupportCard(0.99)).toBe(
      emotionalSupportCards[emotionalSupportCards.length - 1],
    );
  });
});
