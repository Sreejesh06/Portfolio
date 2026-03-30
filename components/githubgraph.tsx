"use client"

import { useEffect, useMemo, useState } from "react";
import { useTheme } from "next-themes";

type ContributionDay = {
  date: string;
  count: number;
  weekday: number;
  level: number;
  sourceCounts?: {
    github: number;
    leetcode: number;
    codeforces: number;
  };
};

type ContributionWeek = {
  firstDay: string;
  days: ContributionDay[];
};

type ContributionCalendar = {
  totalContributions: number;
  sourceTotals?: {
    github?: number;
    leetcode?: number;
    codeforces?: number;
  };
  weeks: ContributionWeek[];
};

interface PR {
  id: number;
  title: string;
  url: string;
  repository: {
    nameWithOwner: string;
  };
  state: string;
  createdAt: string;
  mergedAt?: string;
  closedAt?: string;
}

const GithubGraph = () => {
  const { theme } = useTheme();
  const [prs, setPrs] = useState<PR[]>([]);
  const [calendar, setCalendar] = useState<ContributionCalendar | null>(null);
  const [calendarError, setCalendarError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [filterType, setFilterType] = useState<"all" | "merged" | "open" | "closed">("all");
  const [showPRSection, setShowPRSection] = useState(true);
  const [closedPRIds, setClosedPRIds] = useState<Set<number>>(new Set());
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const initialCount = 2;

  useEffect(() => {
    setMounted(true);
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchContributions = async () => {
      try {
        const response = await fetch("/api/github-contributions", {
          method: "GET",
          cache: "no-store",
        });

        const data = (await response.json()) as {
          totalContributions?: number;
          sourceTotals?: {
            github?: number;
            leetcode?: number;
            codeforces?: number;
          };
          weeks?: ContributionWeek[];
          error?: string;
        };

        if (!response.ok) {
          throw new Error(data.error || "Failed to load contribution heatmap");
        }

        setCalendar({
          totalContributions: data.totalContributions ?? 0,
          sourceTotals: data.sourceTotals,
          weeks: data.weeks ?? [],
        });
        setCalendarError(null);
      } catch (error) {
        console.error("Failed to fetch contribution heatmap:", error);
        setCalendarError("Contribution heatmap is temporarily unavailable.");
      }
    };

    fetchContributions();
  }, []);

  useEffect(() => {
    const fetchPRs = async () => {
      try {
        const response = await fetch(`/api/github-prs?filterType=${filterType}`, {
          method: "GET",
          cache: "no-store",
        });

        const data = await response.json();
        if (data?.prs) {
          const fetchedPRs = data.prs as PR[];
          // Sort by date (newest first)
          fetchedPRs.sort((a: PR, b: PR) => {
            const dateA = new Date(b.mergedAt || b.closedAt || b.createdAt).getTime();
            const dateB = new Date(a.mergedAt || a.closedAt || a.createdAt).getTime();
            return dateA - dateB;
          });
          setPrs(fetchedPRs);
          setShowAll(false);
        }
      } catch (error) {
        console.error("Failed to fetch PRs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPRs();
  }, [filterType]);

  const monthTicks = useMemo(() => {
    if (!calendar?.weeks?.length) {
      return [] as Array<{ index: number; label: string }>;
    }

    const formatter = new Intl.DateTimeFormat("en-US", { month: "short" });
    let previousMonth = -1;
    let previousLabelIndex = -99;

    return calendar.weeks
      .map((week, index) => {
        const month = new Date(week.firstDay).getMonth();
        if (month === previousMonth) {
          return null;
        }

        previousMonth = month;

        // Prevent month labels from colliding on narrow columns (e.g. Mar/Apr)
        if (index - previousLabelIndex < 3) {
          return null;
        }
        previousLabelIndex = index;

        return {
          index,
          label: formatter.format(new Date(week.firstDay)),
        };
      })
      .filter((tick): tick is { index: number; label: string } => tick !== null);
  }, [calendar]);

  const cellSize = isMobile ? 10 : 13;
  const cellGap = isMobile ? 3 : 4;
  const cellStep = cellSize + cellGap;

  const intensityPalette = {
    dark: ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"],
    light: ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"],
  } as const;

  const sourceAccent = {
    dark: {
      github: "rgba(57, 211, 83, 0.55)",
      leetcode: "rgba(255, 161, 22, 0.6)",
      codeforces: "rgba(47, 155, 255, 0.6)",
      none: "transparent",
    },
    light: {
      github: "rgba(33, 110, 57, 0.38)",
      leetcode: "rgba(217, 119, 6, 0.4)",
      codeforces: "rgba(29, 78, 216, 0.38)",
      none: "transparent",
    },
  } as const;

  const getDominantSource = (day: ContributionDay): "github" | "leetcode" | "codeforces" | "none" => {
    if (day.count <= 0) return "none";

    const entries = [
      ["github", day.sourceCounts?.github ?? 0],
      ["leetcode", day.sourceCounts?.leetcode ?? 0],
      ["codeforces", day.sourceCounts?.codeforces ?? 0],
    ] as const;

    let winner: "github" | "leetcode" | "codeforces" = "github";
    let max = -1;

    for (const [source, value] of entries) {
      if (value > max) {
        winner = source;
        max = value;
      }
    }

    return max > 0 ? winner : "none";
  };

  const getDayStyle = (day: ContributionDay) => {
    const mode = theme === "dark" ? "dark" : "light";
    const safeLevel = Math.min(4, Math.max(0, day.level));
    const dominantSource = getDominantSource(day);
    const baseColor = intensityPalette[mode][safeLevel];
    const accentColor = sourceAccent[mode][dominantSource];

    return {
      backgroundColor: baseColor,
      boxShadow: dominantSource === "none" ? "none" : `inset 0 0 0 1px ${accentColor}`,
    };
  };

  const sourceBreakdown = useMemo(() => {
    const github = calendar?.sourceTotals?.github ?? 0;
    const leetcode = calendar?.sourceTotals?.leetcode ?? 0;
    const codeforces = calendar?.sourceTotals?.codeforces ?? 0;
    const total = github + leetcode + codeforces;

    const percent = (value: number) => (total > 0 ? Math.round((value / total) * 100) : 0);

    return {
      github: { count: github, percent: percent(github) },
      leetcode: { count: leetcode, percent: percent(leetcode) },
      codeforces: { count: codeforces, percent: percent(codeforces) },
    };
  }, [calendar]);

  return (
    <div>
      <div className="w-auto border-t border-solid border-[var(--pattern-fg)] opacity-100 dark:opacity-15 mb-2 -mx-2 md:-mx-14"></div>


      <h1 className="text-neutral-900 dark:text-neutral-50 font-custom font-bold  text-3xl tracking-tight  py-2"><span className="link--elara">Proof Of Work</span></h1>
      <div className="w-auto border-t border-solid border-[var(--pattern-fg)] opacity-100 dark:opacity-15 mb-4 -mx-2 md:-mx-14"></div>
      <p className=" font-custom2 text-neutral-700 dark:text-neutral-300 mt-3 px-2 py-[7px]
           text-sm inline-block
          bg-neutral-100 dark:bg-neutral-900 border-dashed border-neutral-300 dark:border-neutral-700 border mb-6"> I live spending time in open source,building real stuff and solving real problems</p>




      {/* Graph Component */}
      <div className="w-full flex justify-center">
        <div className="w-full">
          {mounted && calendar ? (
            <div>
              <div className="w-full overflow-x-auto pb-2">
                <div className="inline-block" style={{ minWidth: calendar.weeks.length * cellStep }}>
                  <div className="relative mb-3 h-6" style={{ width: calendar.weeks.length * cellStep }}>
                    {monthTicks.map((tick) => (
                      <span
                        key={`${tick.label}-${tick.index}`}
                        className="absolute top-0 text-xs text-neutral-500 dark:text-neutral-400"
                        style={{ left: tick.index * cellStep }}
                      >
                        {tick.label}
                      </span>
                    ))}
                  </div>

                  <div className="flex" style={{ gap: cellGap }}>
                    {calendar.weeks.map((week) => (
                      <div key={week.firstDay} className="grid grid-rows-7" style={{ gap: cellGap }}>
                        {week.days.map((day) => (
                          <div
                            key={day.date}
                            className="rounded-[3px] transition-transform duration-150 hover:scale-110"
                            style={{
                              width: cellSize,
                              height: cellSize,
                              ...getDayStyle(day),
                            }}
                            title={`${day.count} contributions on ${day.date} (GitHub ${day.sourceCounts?.github ?? 0} | LeetCode ${day.sourceCounts?.leetcode ?? 0} | Codeforces ${day.sourceCounts?.codeforces ?? 0})`}
                            aria-label={`${day.count} contributions on ${day.date}`}
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-neutral-700 dark:text-neutral-300 font-custom2">
                <div className="flex flex-col gap-1">
                  <p>{calendar.totalContributions} activities in the last year</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    GitHub {calendar.sourceTotals?.github ?? 0} | LeetCode {calendar.sourceTotals?.leetcode ?? 0} | Codeforces {calendar.sourceTotals?.codeforces ?? 0}
                  </p>
                </div>
                <div className="flex items-center gap-5 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="text-neutral-500 dark:text-neutral-400">Intensity</span>
                    {[0, 1, 2, 3, 4].map((level) => (
                      <span
                        key={level}
                        className="rounded-[3px]"
                        style={{
                          width: 10,
                          height: 10,
                          backgroundColor:
                            theme === "dark"
                              ? intensityPalette.dark[level]
                              : intensityPalette.light[level],
                        }}
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 text-neutral-500 dark:text-neutral-400">
                      <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#2f9bff]" />
                      CF {sourceBreakdown.codeforces.percent}%
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-neutral-500 dark:text-neutral-400">
                      <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#39d353]" />
                      GH {sourceBreakdown.github.percent}%
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-neutral-500 dark:text-neutral-400">
                      <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#ffa116]" />
                      LC {sourceBreakdown.leetcode.percent}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-sm text-neutral-600 dark:text-neutral-400 font-custom2">
              {calendarError || "Loading contribution heatmap..."}
            </div>
          )}
        </div>
      </div>
      {showPRSection && (
        <div className="mt-4">
          <div className="mb-1 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-neutral-900 dark:text-neutral-50 font-custom font-bold text-2xl tracking-tight">
              <span className="link--elara">Pull Requests</span>
            </h2>
            <div className="flex items-center gap-2">
              <div className="relative grid grid-cols-4 p-1 bg-black/5 dark:bg-white/5 rounded-lg border border-neutral-300/30 dark:border-neutral-700/30 w-fit select-none">
                {/* Sliding Pill Background */}
                <div
                  className={`absolute top-1 bottom-1 left-1 w-[calc((100%-8px)/4)] rounded bg-white dark:bg-neutral-800 shadow-sm transition-transform duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] transform will-change-transform ${filterType === "all" ? "translate-x-0" : filterType === "merged" ? "translate-x-[100%]" : filterType === "open" ? "translate-x-[200%]" : "translate-x-[300%]"
                    }`}
                />

                {/* Buttons */}
                <button
                  onClick={() => setFilterType("all")}
                  className={`z-10 relative px-3 py-1.5 text-xs font-medium text-center transition-colors duration-200 ${filterType === "all"
                    ? "text-neutral-900 dark:text-neutral-50"
                    : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
                    }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterType("merged")}
                  className={`z-10 relative px-3 py-1.5 text-xs font-medium text-center transition-colors duration-200 ${filterType === "merged"
                    ? "text-neutral-900 dark:text-neutral-50"
                    : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
                    }`}
                >
                  Merged
                </button>
                <button
                  onClick={() => setFilterType("open")}
                  className={`z-10 relative px-3 py-1.5 text-xs font-medium text-center transition-colors duration-200 ${filterType === "open"
                    ? "text-neutral-900 dark:text-neutral-50"
                    : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
                    }`}
                >
                  Open
                </button>
                <button
                  onClick={() => setFilterType("closed")}
                  className={`z-10 relative px-3 py-1.5 text-xs font-medium text-center transition-colors duration-200 ${filterType === "closed"
                    ? "text-neutral-900 dark:text-neutral-50"
                    : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
                    }`}
                >
                  Closed
                </button>
              </div>
            </div>
          </div>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 font-custom2 mb-4">
            {filterType === "all"
              ? "All pull requests"
              : filterType === "merged"
                ? "Merged contributions to open source"
                : filterType === "open"
                  ? "Active pull requests"
                  : "Closed pull requests"}
          </p>
          <div className="w-auto border-t border-solid border-[var(--pattern-fg)] opacity-100 dark:opacity-15 mb-4 -mx-2 md:-mx-14 mt-6"></div>

          {loading ? (
            <div className="text-neutral-600 dark:text-neutral-400 font-custom2 text-sm mt-4">Loading pull requests...</div>
          ) : prs.length > 0 ? (
            <div>
              <div className="space-y-2 mt-5">
                {prs.slice(0, showAll ? prs.length : initialCount).filter(pr => !closedPRIds.has(pr.id)).map((pr, index) => (
                  <div key={pr.id} className="group flex items-start gap-3 p-3 rounded-md transition-all duration-200 hover:bg-neutral-100 dark:hover:bg-neutral-800/50 border border-transparent hover:border-neutral-300/50 dark:hover:border-neutral-700/50">
                    <div className="shrink-0 mt-0.5">
                      <div className={`w-1 h-1 rounded-full group-hover:scale-150 transition-transform duration-200 ${pr.state === "MERGED"
                        ? "bg-linear-to-r from-purple-400 to-pink-400"
                        : pr.state === "OPEN"
                          ? "bg-linear-to-r from-green-400 to-emerald-400"
                          : "bg-linear-to-r from-red-400 to-rose-400"
                        }`}></div>
                    </div>
                    <a
                      href={pr.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 min-w-0 hover:no-underline"
                    >
                      <h3 className="text-sm font-medium text-neutral-900 dark:text-neutral-50 group-hover:text-neutral-700 dark:group-hover:text-neutral-200 transition-colors truncate">
                        {pr.title}
                      </h3>
                      <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-0.5 font-custom2">
                        {pr.repository.nameWithOwner}
                      </p>
                    </a>
                  </div>
                ))}
              </div>
              {prs.length > initialCount && (
                <div className="flex justify-center mt-6">
                  <button
                    onClick={() => setShowAll(!showAll)}
                    className="group relative overflow-hidden rounded-lg  w-full
                            bg-linear-to-b from-white to-neutral-100 dark:from-neutral-800 dark:to-neutral-900 
                            border border-neutral-200 dark:border-neutral-800 
                            text-neutral-800 dark:text-neutral-200 text-sm font-medium px-6 py-2.5 
                            transition-all duration-300 
                            hover:from-neutral-50 hover:to-neutral-100 dark:hover:from-neutral-800 dark:hover:to-neutral-800
                            shadow-[0_1px_2px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,1)] 
                            dark:shadow-[0_1px_2px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.05)]"
                  >
                    {showAll ? "↑ Collapse" : `↓ Expand • ${prs.length - closedPRIds.size - initialCount} more`}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-secondary font-custom2 text-sm mt-4">No pull requests found</div>
          )}
        </div>
      )}
    </div>

  );
};

export default GithubGraph;
