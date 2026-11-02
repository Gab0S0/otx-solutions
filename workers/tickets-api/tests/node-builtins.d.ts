declare module 'node:assert/strict' {
  function equal(actual: unknown, expected: unknown, message?: string): void;
  function notEqual(actual: unknown, expected: unknown, message?: string): void;
  function ok(value: unknown, message?: string): void;
  function match(value: string, regExp: RegExp, message?: string): void;
  const assert: {
    equal: typeof equal;
    notEqual: typeof notEqual;
    ok: typeof ok;
    match: typeof match;
  };
  export default assert;
}

declare module 'node:fs' {
  export function readFileSync(path: string, encoding: string): string;
  export function mkdtempSync(prefix: string): string;
  export function rmSync(path: string, options?: { recursive?: boolean; force?: boolean }): void;
  export function existsSync(path: string): boolean;
  const fs: {
    readFileSync: typeof readFileSync;
    mkdtempSync: typeof mkdtempSync;
    rmSync: typeof rmSync;
    existsSync: typeof existsSync;
  };
  export default fs;
}

declare module 'node:os' {
  export function tmpdir(): string;
  const os: { tmpdir: typeof tmpdir };
  export default os;
}

declare module 'node:path' {
  export function resolve(...paths: string[]): string;
  export function dirname(p: string): string;
  export function join(...paths: string[]): string;
  const path: {
    resolve: typeof resolve;
    dirname: typeof dirname;
    join: typeof join;
  };
  export default path;
}

declare module 'node:url' {
  export function fileURLToPath(url: string | URL): string;
}

declare module 'node:child_process' {
  export interface SpawnSyncResult {
    status: number | null;
    stdout: string;
    stderr: string;
    error?: Error;
  }
  export function spawnSync(
    command: string,
    args?: string[],
    options?: { cwd?: string; encoding?: string; shell?: boolean }
  ): SpawnSyncResult;
}

declare module 'node:sqlite' {
  export interface StatementResultingChanges {
    changes: number | bigint;
    lastInsertRowid: number | bigint;
  }
  export class StatementSync {
    get(...params: unknown[]): unknown;
    all(...params: unknown[]): unknown[];
    run(...params: unknown[]): StatementResultingChanges;
  }
  export class DatabaseSync {
    constructor(location: string);
    exec(sql: string): void;
    prepare(sql: string): StatementSync;
    close(): void;
  }
}

declare const process: {
  exit(code?: number): never;
  cwd(): string;
  env: Record<string, string | undefined>;
};

declare module 'wrangler' {
  import type { ExecutionContextLike } from '../src/types.ts';
  export interface PlatformProxyOptions {
    configPath?: string;
    persist?: boolean | { path: string };
  }
  export interface PlatformProxy<EnvBindings = Record<string, unknown>> {
    env: EnvBindings;
    ctx: ExecutionContextLike;
    dispose(): Promise<void>;
  }
  export function getPlatformProxy<EnvBindings = Record<string, unknown>>(
    options?: PlatformProxyOptions
  ): Promise<PlatformProxy<EnvBindings>>;
}
