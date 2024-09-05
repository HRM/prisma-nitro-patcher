export class PresentableError extends Error {
  constructor(
    message: string,
    private level: 'error' | 'warn' = 'error',
  ) {
    super(message);
    Error.captureStackTrace?.(this);
  }
  protected present(console: Console) {
    console[this.level](this.message);
  }
  public static presentError(error: unknown, consoleToUse: Console = console) {
    if (error instanceof PresentableError) {
      error.present(consoleToUse);
    } else if (error instanceof Error) {
      console.error(error.toString());
    } else {
      console.error('some unknown error happened');
    }
  }
}
