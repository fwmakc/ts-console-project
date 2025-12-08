export function error(message: string, error: unknown | null): void {
  console.error(`\n❌ ${message}`);

  if (error) {
    console.error(error);
  }

  process.exit();
}
