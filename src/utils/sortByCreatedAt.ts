export const sortByCreatedAt = <T extends { created_at: Date }>(values: T[]) =>
  [...values].sort(
    (left, right) => left.created_at.getTime() - right.created_at.getTime(),
);