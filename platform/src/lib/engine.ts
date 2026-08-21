import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";

/**
 * The bridge to the Python engine in engine/.
 *
 * The delivery engine — the nine agents, the model routing and the report
 * renderer — lives in Python; this app owns the interface. They meet at a
 * subprocess rather than at an HTTP service. For one operator on one machine a
 * service would add a port, a second process to start and a health check, and
 * buy nothing: a route handler blocks for the length of a pipeline run either
 * way, and a crashed subprocess is easier to reason about than a hung socket.
 *
 * The engine prints one JSON object on stdout and nothing else. Progress and
 * tracebacks go to stderr, which is forwarded to this process's stderr so a
 * pipeline run shows up in `npm run dev` as it happens rather than in a lump
 * at the end.
 */

const ENGINE_DIR = path.resolve(process.cwd(), "..", "engine");

export interface EngineResult {
  ok: boolean;
  executiveSummary?: string;
  brief?: Record<string, string>;
  repaired?: string[];
  error?: string;
}

/**
 * The installed console script first, `uv run` second.
 *
 * Once `uv sync` has run, the venv binary is a direct exec with no resolver in
 * front of it. Falling back to `uv run` keeps a fresh clone working before
 * anyone has synced, which is the case a new user is actually in.
 */
function resolveCommand(args: string[]): { file: string; argv: string[] } {
  const installed = path.join(ENGINE_DIR, ".venv", "bin", "fde-engine");
  if (existsSync(installed)) return { file: installed, argv: args };
  return { file: "uv", argv: ["run", "--directory", ENGINE_DIR, "fde-engine", ...args] };
}

export function callEngine(
  command: "run" | "regenerate-report",
  engagementId: string
): Promise<EngineResult> {
  return invoke([command, engagementId]);
}

/**
 * For commands whose input is a document rather than an id. A discovery intake
 * runs to tens of kilobytes, past what an argument list will carry, so it goes
 * down stdin.
 */
export function callEngineWithInput(
  command: "extract-brief",
  input: string
): Promise<EngineResult> {
  return invoke([command], input);
}

function invoke(args: string[], input?: string): Promise<EngineResult> {
  const { file, argv } = resolveCommand(args);

  return new Promise((resolve) => {
    const child = spawn(file, argv, { cwd: ENGINE_DIR });

    if (input !== undefined) {
      child.stdin.end(input);
    }

    let stdout = "";
    child.stdout.on("data", (chunk) => (stdout += chunk));
    child.stderr.on("data", (chunk) => process.stderr.write(chunk));

    child.on("error", (err) =>
      resolve({
        ok: false,
        error:
          `Could not start the delivery engine (${file}). ` +
          `Run \`uv sync\` in engine/, or install uv. — ${err.message}`,
      })
    );

    child.on("close", (code) => {
      // The engine reports failure as JSON with ok:false, so a parse failure
      // means it died before it could say anything — a missing interpreter, an
      // import error, a kill signal. Those leave nothing on stdout, and the
      // reason is already on stderr.
      const line = stdout.trim().split("\n").at(-1) ?? "";
      try {
        return resolve(JSON.parse(line) as EngineResult);
      } catch {
        return resolve({
          ok: false,
          error: `The delivery engine exited with code ${code} without reporting a result. See the server log.`,
        });
      }
    });
  });
}
