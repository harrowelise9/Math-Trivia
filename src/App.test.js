import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import App from './App';

beforeEach(() => {
  global.fetch = jest.fn().mockResolvedValue({
    json: async () => ({
      results: Array.from({ length: 10 }, (_, index) => ({
        question: `Question ${index + 1}`,
        correct_answer: 'Correct',
        incorrect_answers: ['Wrong 1', 'Wrong 2', 'Wrong 3'],
      })),
    }),
  });
});

afterEach(() => {
  jest.resetAllMocks();
});

test('allows restarting the game after answering all questions', async () => {
  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: /start/i }));

  await waitFor(() => expect(screen.getByText(/Question 1/i)).toBeInTheDocument());

  for (let i = 0; i < 10; i += 1) {
    fireEvent.click(screen.getByRole('button', { name: /correct/i }));
  }

  await waitFor(() => expect(screen.getByRole('button', { name: /restart game/i })).toBeInTheDocument());

  fireEvent.click(screen.getByRole('button', { name: /restart game/i }));

  await waitFor(() => expect(screen.getByText(/Question 1/i)).toBeInTheDocument());
});
