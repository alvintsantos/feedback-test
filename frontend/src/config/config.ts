// @ts-ignore - Workaround for Vite env variable typing
export const API_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.example.com';

// Emoji configuration
export const HAPPINESS_EMOJIS = ['🥲', '😐', '🙂', '😊', '🤩'];
export const HAPPINESS_LABELS = {
  min: 'Not happy',
  max: 'Very happy'
};