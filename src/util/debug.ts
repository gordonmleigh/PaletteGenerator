class Debug {
  private static enabled = process.env.NODE_ENV !== "production";

  constructor(private readonly name: string) {}

  public log(fmt: string, ...args: any[]): void {
    if (!Debug.enabled) {
      return;
    }
    console.log("[%s] " + fmt, this.name, ...args);
  }
}

export interface Debugger {
  (fmt: string, ...args: any[]): void;
}

export function debug(name: string): Debugger {
  const instance = new Debug(name);
  return instance.log.bind(instance);
}

export default debug;
