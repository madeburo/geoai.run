"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { Terminal } from "lucide-react";

const STEPS = [
  {
    cmd: "npx geo-ai init",
    outputs: ["✓ Created geo-ai.config.ts"],
  },
  {
    cmd: "npx geo-ai generate",
    outputs: ["✓ Generated llms.txt", "✓ Generated llms-full.txt"],
  },
  {
    cmd: "npx geo-ai validate",
    outputs: ["✓ Validation passed"],
  },
];

const TYPING_SPEED = 38; // ms per character
const PAUSE_AFTER_CMD = 420; // ms before showing output
const PAUSE_AFTER_OUTPUT = 900; // ms before next command
const PAUSE_BETWEEN_OUTPUTS = 180; // ms between output lines
const LOOP_PAUSE = 1800; // ms before restarting

type CmdLine = { type: "cmd"; text: string; partial?: boolean };
type OutputLine = { type: "output"; text: string };
type Line = CmdLine | OutputLine;

export function CliTerminalPreview() {
  const reduced = useReducedMotion();
  const [lines, setLines] = useState<Line[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (reduced) {
      // Show all lines statically
      const all: Line[] = [];
      for (const step of STEPS) {
        all.push({ type: "cmd", text: step.cmd });
        for (const o of step.outputs) all.push({ type: "output", text: o });
      }
      setLines(all);
      return;
    }

    let cancelled = false;

    function schedule(fn: () => void, delay: number) {
      timerRef.current = setTimeout(() => {
        if (!cancelled) fn();
      }, delay);
    }

    function runSequence() {
      setLines([]);
      let stepIdx = 0;

      function nextStep() {
        if (stepIdx >= STEPS.length) {
          schedule(runSequence, LOOP_PAUSE);
          return;
        }
        const step = STEPS[stepIdx++];
        typeCommand(step.cmd, 0, () => {
          schedule(() => showOutputs(step.outputs, 0, nextStep), PAUSE_AFTER_CMD);
        });
      }

      function typeCommand(cmd: string, charIdx: number, onDone: () => void) {
        const partial = cmd.slice(0, charIdx + 1);
        setLines((prev) => {
          const next = [...prev];
          // Replace last cmd line if partial, else push new
          if (next.length > 0 && next[next.length - 1].type === "cmd" && (next[next.length - 1] as CmdLine).partial) {
            next[next.length - 1] = { type: "cmd", text: partial, partial: true };
          } else {
            next.push({ type: "cmd", text: partial, partial: true });
          }
          return next;
        });
        if (charIdx + 1 < cmd.length) {
          schedule(() => typeCommand(cmd, charIdx + 1, onDone), TYPING_SPEED);
        } else {
          // Finalize command (remove partial flag)
          setLines((prev) => {
            const next = [...prev];
            next[next.length - 1] = { type: "cmd", text: cmd };
            return next;
          });
          onDone();
        }
      }

      function showOutputs(outputs: string[], idx: number, onDone: () => void) {
        if (idx >= outputs.length) {
          schedule(onDone, PAUSE_AFTER_OUTPUT);
          return;
        }
        setLines((prev) => [...prev, { type: "output", text: outputs[idx] }]);
        schedule(() => showOutputs(outputs, idx + 1, onDone), PAUSE_BETWEEN_OUTPUTS);
      }

      nextStep();
    }

    runSequence();

    return () => {
      cancelled = true;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [reduced]);

  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-[#060914] shadow-[0_0_40px_-8px_oklch(0.72_0.17_162/18%)] dark:shadow-[0_0_48px_-8px_oklch(0.72_0.17_162/22%)]">
      {/* Title bar */}
      <div className="flex items-center gap-2 border-b border-white/8 bg-white/4 px-4 py-2.5">
        <div className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-white/15" />
          <span className="size-2.5 rounded-full bg-white/15" />
          <span className="size-2.5 rounded-full bg-white/15" />
        </div>
        <div className="flex flex-1 items-center justify-center gap-1.5">
          <Terminal className="size-3 text-glow/60" />
          <span className="font-mono text-[10px] font-semibold tracking-wide text-white/40">
            Terminal
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="min-h-[200px] p-5 font-mono text-[13px] leading-[1.8]">
        {lines.map((line, i) => (
          <div key={i}>
            {line.type === "cmd" ? (
              <span className="text-white/90">
                <span className="text-glow/70 select-none">$ </span>
                {line.text}
                {(line as CmdLine).partial && (
                  <span className="ml-px inline-block w-[7px] h-[13px] translate-y-[2px] bg-glow/70 animate-pulse" />
                )}
              </span>
            ) : (
              <span className="text-glow/80">{line.text}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
