export async function mapInBatches<T, R>(
  items: T[],
  mapper: (item: T) => Promise<R>,
  batchSize = 4,
): Promise<R[]> {
  const results: R[] = [];
  for (let index = 0; index < items.length; index += batchSize) {
    const batch = items.slice(index, index + batchSize);
    results.push(...(await Promise.all(batch.map(mapper))));
  }
  return results;
}
