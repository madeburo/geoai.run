import { cn } from "@/lib/utils";
import { Info, AlertTriangle, Lightbulb, CheckCircle } from "lucide-react";

type CalloutType = "note" | "warning" | "tip" | "success";

interface CalloutProps {
  type?: CalloutType;
  title?: string;
  children: React.ReactNode;
}

const config: Record<CalloutType, { icon: React.ElementType; classes: string; titleColor: string }> = {
  note: {
    icon: Info,
    classes: "border-blue-500/20 bg-blue-500/5 dark:border-blue-400/15 dark:bg-blue-400/5",
    titleColor: "text-blue-600 dark:text-blue-400",
  },
  warning: {
    icon: AlertTriangle,
    classes: "border-amber-500/20 bg-amber-500/5 dark:border-amber-400/15 dark:bg-amber-400/5",
    titleColor: "text-amber-600 dark:text-amber-400",
  },
  tip: {
    icon: Lightbulb,
    classes: "border-glow/20 bg-glow/5 dark:border-glow/15 dark:bg-glow/5",
    titleColor: "text-glow",
  },
  success: {
    icon: CheckCircle,
    classes: "border-emerald-500/20 bg-emerald-500/5 dark:border-emerald-400/15 dark:bg-emerald-400/5",
    titleColor: "text-emerald-600 dark:text-emerald-400",
  },
};

export function Callout({ type = "note", title, children }: CalloutProps) {
  const { icon: Icon, classes, titleColor } = config[type];
  return (
    <div className={cn("my-6 flex gap-3 rounded-lg border px-4 py-3.5", classes)}>
      <Icon className={cn("mt-0.5 size-4 shrink-0", titleColor)} />
      <div className="min-w-0 text-sm leading-relaxed">
        {title && <p className={cn("mb-1 font-semibold", titleColor)}>{title}</p>}
        <div className="text-foreground/80">{children}</div>
      </div>
    </div>
  );
}
