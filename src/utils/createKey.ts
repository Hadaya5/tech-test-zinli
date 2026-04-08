export const createKey = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;