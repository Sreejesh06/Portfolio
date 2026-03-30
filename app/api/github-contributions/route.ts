import { NextResponse } from "next/server";

type ContributionLevel =
  | "NONE"
  | "FIRST_QUARTILE"
  | "SECOND_QUARTILE"
  | "THIRD_QUARTILE"
  | "FOURTH_QUARTILE";

type SourceName = "github" | "leetcode" | "codeforces";

type DateCountMap = Record<string, number>;

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

const QUERY = `
  query GetContributions($login: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $login) {
      contributionsCollection(from: $from, to: $to) {
        contributionCalendar {
          totalContributions
          weeks {
            firstDay
            contributionDays {
              date
              contributionCount
              contributionLevel
              weekday
            }
          }
        }
      }
    }
  }
`;

const levelToScore: Record<ContributionLevel, number> = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
};

const GITHUB_USERNAME = process.env.GITHUB_USERNAME || "Sreejesh06";
const LEETCODE_USERNAME = process.env.LEETCODE_USERNAME || "Sreejesh06";
const CODEFORCES_HANDLE = process.env.CODEFORCES_HANDLE || "Sreejesh";
const LEETCODE_API_BASE =
  process.env.LEETCODE_API_BASE || "https://alfa-leetcode-api.onrender.com";
const LEETCODE_API_BACKUP_BASE =
  process.env.LEETCODE_API_BACKUP_BASE || "https://leetcode-api-pied.vercel.app";
const LEETCODE_BACKUP_USERNAME =
  process.env.LEETCODE_BACKUP_USERNAME || LEETCODE_USERNAME;
const CODEFORCES_FALLBACK_HANDLE = process.env.CODEFORCES_FALLBACK_HANDLE || GITHUB_USERNAME;

const LEETCODE_QUERY = `
  query userProfileCalendar($username: String!, $year: Int) {
    matchedUser(username: $username) {
      userCalendar(year: $year) {
        submissionCalendar
      }
    }
  }
`;

const formatDate = (date: Date): string => date.toISOString().slice(0, 10);

const makeDateRangeMap = (from: Date, to: Date): DateCountMap => {
  const map: DateCountMap = {};
  for (let ts = from.getTime(); ts <= to.getTime(); ts += ONE_DAY_MS) {
    map[formatDate(new Date(ts))] = 0;
  }
  return map;
};

const addDateMap = (target: DateCountMap, source: DateCountMap) => {
  for (const [date, count] of Object.entries(source)) {
    if (!(date in target)) continue;
    target[date] += count;
  }
};

const percentile = (sorted: number[], p: number): number => {
  if (sorted.length === 0) return 0;
  const index = Math.min(sorted.length - 1, Math.max(0, Math.floor((sorted.length - 1) * p)));
  return sorted[index] ?? 0;
};

const buildLevelFn = (counts: number[]) => {
  const nonZero = counts.filter((n) => n > 0).sort((a, b) => a - b);
  if (nonZero.length === 0) {
    return () => 0;
  }

  const q1 = percentile(nonZero, 0.25);
  const q2 = percentile(nonZero, 0.5);
  const q3 = percentile(nonZero, 0.75);

  return (count: number) => {
    if (count <= 0) return 0;
    if (count <= q1) return 1;
    if (count <= q2) return 2;
    if (count <= q3) return 3;
    return 4;
  };
};

const getRangeBounds = () => {
  const to = new Date();
  const from = new Date(to);
  from.setFullYear(from.getFullYear() - 1);
  from.setHours(0, 0, 0, 0);
  to.setHours(0, 0, 0, 0);
  return { from, to };
};

const fetchGithubCounts = async (
  token: string,
  from: Date,
  to: Date,
): Promise<DateCountMap> => {
  const githubResponse = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/vnd.github+json",
    },
    body: JSON.stringify({
      query: QUERY,
      variables: {
        login: GITHUB_USERNAME,
        from: from.toISOString(),
        to: to.toISOString(),
      },
    }),
    cache: "no-store",
  });

  if (!githubResponse.ok) {
    return {};
  }

  const payload = (await githubResponse.json()) as {
    data?: {
      user?: {
        contributionsCollection?: {
          contributionCalendar?: {
            weeks: Array<{
              contributionDays: Array<{
                date: string;
                contributionCount: number;
                contributionLevel: ContributionLevel;
              }>;
            }>;
          };
        };
      };
    };
    errors?: Array<{ message: string }>;
  };

  if (payload.errors?.length) {
    return {};
  }

  const calendar = payload.data?.user?.contributionsCollection?.contributionCalendar;
  if (!calendar) {
    return {};
  }

  const counts: DateCountMap = {};
  for (const week of calendar.weeks) {
    for (const day of week.contributionDays) {
      counts[day.date] = day.contributionCount;
      void levelToScore[day.contributionLevel];
    }
  }
  return counts;
};

const fetchLeetCodeCounts = async (from: Date, to: Date): Promise<DateCountMap> => {
  const years = new Set<number>([from.getUTCFullYear(), to.getUTCFullYear()]);
  const counts: DateCountMap = {};

  const parseCalendarDate = (rawDate: string): Date | null => {
    const numeric = Number(rawDate);
    if (Number.isFinite(numeric)) {
      // Most providers return epoch seconds, some return epoch milliseconds.
      const epochMs = rawDate.length > 10 ? numeric : numeric * 1000;
      const date = new Date(epochMs);
      return Number.isNaN(date.getTime()) ? null : date;
    }

    const date = new Date(rawDate);
    return Number.isNaN(date.getTime()) ? null : date;
  };

  const addCalendarEntries = (parsed: Record<string, number>) => {
    for (const [rawDate, rawValue] of Object.entries(parsed)) {
      const date = parseCalendarDate(rawDate);
      if (!date) continue;
      if (Number.isNaN(date.getTime())) continue;
      if (date < from || date > to) continue;

      const value = Number(rawValue);
      if (!Number.isFinite(value)) continue;

      const key = formatDate(date);
      counts[key] = (counts[key] ?? 0) + value;
    }
  };

  const parseCalendar = (rawCalendar: unknown): Record<string, number> => {
    if (!rawCalendar) {
      return {};
    }

    if (typeof rawCalendar === "string") {
      try {
        return JSON.parse(rawCalendar) as Record<string, number>;
      } catch {
        return {};
      }
    }

    if (typeof rawCalendar === "object") {
      return rawCalendar as Record<string, number>;
    }

    return {};
  };

  const fetchFromGraphQLYear = async (year: number): Promise<boolean> => {
    const response = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: LEETCODE_QUERY,
        variables: {
          username: LEETCODE_USERNAME,
          year,
        },
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      return false;
    }

    const payload = (await response.json()) as {
      data?: {
        matchedUser?: {
          userCalendar?: {
            submissionCalendar?: string | Record<string, number>;
          };
        };
      };
    };

    const parsed = parseCalendar(payload.data?.matchedUser?.userCalendar?.submissionCalendar);
    addCalendarEntries(parsed);
    return Object.keys(parsed).length > 0;
  };

  const fetchFromAlfaYear = async (year: number): Promise<boolean> => {
    const response = await fetch(
      `${LEETCODE_API_BASE}/${encodeURIComponent(LEETCODE_USERNAME)}/calendar?year=${year}`,
      {
        cache: "no-store",
      },
    );

    if (!response.ok) {
      return false;
    }

    const payload = (await response.json()) as {
      submissionCalendar?: string | Record<string, number>;
      calendar?: string | Record<string, number>;
      data?: {
        submissionCalendar?: string | Record<string, number>;
        calendar?: string | Record<string, number>;
      };
      matchedUser?: {
        userCalendar?: {
          submissionCalendar?: string | Record<string, number>;
        };
      };
    };

    const rawCalendar =
      payload.submissionCalendar ||
      payload.calendar ||
      payload.data?.submissionCalendar ||
      payload.data?.calendar ||
      payload.matchedUser?.userCalendar?.submissionCalendar;

    if (!rawCalendar) {
      return false;
    }

    const parsed = parseCalendar(rawCalendar);
    if (Object.keys(parsed).length === 0) {
      return false;
    }

    addCalendarEntries(parsed);
    return true;
  };

  const fetchFromBackupApiYear = async (year: number): Promise<boolean> => {
    const usernames = Array.from(new Set([LEETCODE_BACKUP_USERNAME, LEETCODE_USERNAME]));

    for (const username of usernames) {
      const response = await fetch(
        `${LEETCODE_API_BACKUP_BASE}/user/${encodeURIComponent(username)}/calendar`,
        {
          cache: "no-store",
        },
      );

      if (!response.ok) {
        continue;
      }

      const payload = (await response.json()) as {
        submissionCalendar?: string | Record<string, number>;
        calendar?: string | Record<string, number>;
        activeYears?: number[];
        detail?: string;
      };

      if (typeof payload.detail === "string" && payload.detail.toLowerCase().includes("not found")) {
        continue;
      }

      if (payload.activeYears && payload.activeYears.length > 0 && !payload.activeYears.includes(year)) {
        continue;
      }

      const rawCalendar = payload.submissionCalendar || payload.calendar;
      const parsed = parseCalendar(rawCalendar);
      if (Object.keys(parsed).length === 0) {
        continue;
      }

      addCalendarEntries(parsed);
      return true;
    }

    return false;
  };

  const fetchFromLeetCodeQuery = async (): Promise<boolean> => {
    try {
      const { LeetCode } = await import("leetcode-query");
      const client = new LeetCode();
      const usernames = Array.from(new Set([LEETCODE_BACKUP_USERNAME, LEETCODE_USERNAME]));

      const extractCalendars = (node: unknown): Array<string | Record<string, number>> => {
        const calendars: Array<string | Record<string, number>> = [];
        const stack: unknown[] = [node];
        const seen = new Set<object>();

        while (stack.length > 0) {
          const current = stack.pop();
          if (!current || typeof current !== "object") continue;
          if (seen.has(current)) continue;

          seen.add(current);

          const record = current as Record<string, unknown>;
          const submissionCalendar = record.submissionCalendar;
          const calendar = record.calendar;

          if (
            typeof submissionCalendar === "string" ||
            (submissionCalendar && typeof submissionCalendar === "object")
          ) {
            calendars.push(submissionCalendar as string | Record<string, number>);
          }

          if (typeof calendar === "string" || (calendar && typeof calendar === "object")) {
            calendars.push(calendar as string | Record<string, number>);
          }

          for (const value of Object.values(record)) {
            if (value && typeof value === "object") {
              stack.push(value);
            }
          }
        }

        return calendars;
      };

      for (const username of usernames) {
        const profile = await client.user(username);
        const calendars = extractCalendars(profile);
        let foundData = false;

        for (const rawCalendar of calendars) {
          const parsed = parseCalendar(rawCalendar);
          if (Object.keys(parsed).length === 0) continue;

          addCalendarEntries(parsed);
          foundData = true;
        }

        if (foundData) {
          return true;
        }
      }

      return false;
    } catch {
      return false;
    }
  };

  for (const year of years) {
    const fromAlfa = await fetchFromAlfaYear(year);
    if (fromAlfa) continue;

    const fromBackupApi = await fetchFromBackupApiYear(year);
    if (fromBackupApi) continue;

    await fetchFromGraphQLYear(year);
  }

  if (Object.keys(counts).length === 0) {
    await fetchFromLeetCodeQuery();
  }

  return counts;
};

const fetchCodeforcesCounts = async (from: Date, to: Date): Promise<DateCountMap> => {
  const handles = Array.from(
    new Set(
      [CODEFORCES_HANDLE, CODEFORCES_FALLBACK_HANDLE]
        .map((handle) => handle.trim())
        .filter((handle) => handle.length > 0),
    ),
  );

  const fetchPayload = async (url: string) => {
    let lastError: unknown;

    for (let attempt = 0; attempt < 2; attempt += 1) {
      try {
        const response = await fetch(url, {
          cache: "no-store",
          headers: {
            "User-Agent": "Mozilla/5.0 (compatible; PortfolioBot/1.0)",
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          continue;
        }

        return (await response.json()) as {
          status?: string;
          result?: Array<{
            creationTimeSeconds: number;
            verdict?: string;
          }>;
          comment?: string;
        };
      } catch (error) {
        lastError = error;
      }
    }

    if (lastError) {
      throw lastError;
    }

    return null;
  };

  for (const handle of handles) {
    const url = `https://codeforces.com/api/user.status?handle=${encodeURIComponent(handle)}&from=1&count=10000`;

    try {
      const payload = await fetchPayload(url);
      if (!payload) continue;
      if (payload.status !== "OK" || !payload.result) continue;

      const counts: DateCountMap = {};
      for (const submission of payload.result) {
        const date = new Date(submission.creationTimeSeconds * 1000);
        if (Number.isNaN(date.getTime())) continue;
        if (date < from || date > to) continue;
        if (submission.verdict !== "OK") continue;

        const key = formatDate(date);
        counts[key] = (counts[key] ?? 0) + 1;
      }

      if (Object.keys(counts).length > 0) {
        return counts;
      }
    } catch {
      continue;
    }
  }

  return {};
};

export async function GET() {
  const token = process.env.GITHUB_TOKEN;

  const { from, to } = getRangeBounds();
  const combinedCounts = makeDateRangeMap(from, to);
  const sourceTotals: Record<SourceName, number> = {
    github: 0,
    leetcode: 0,
    codeforces: 0,
  };

  const [githubResult, leetcodeResult, codeforcesResult] = await Promise.allSettled([
    token ? fetchGithubCounts(token, from, to) : Promise.resolve({}),
    fetchLeetCodeCounts(from, to),
    fetchCodeforcesCounts(from, to),
  ]);

  const sourceMaps: Record<SourceName, DateCountMap> = {
    github: githubResult.status === "fulfilled" ? githubResult.value : {},
    leetcode: leetcodeResult.status === "fulfilled" ? leetcodeResult.value : {},
    codeforces: codeforcesResult.status === "fulfilled" ? codeforcesResult.value : {},
  };

  for (const source of ["github", "leetcode", "codeforces"] as const) {
    const map = sourceMaps[source];
    addDateMap(combinedCounts, map);
    sourceTotals[source] = Object.values(map).reduce((sum, count) => sum + count, 0);
  }

  const levelForCount = buildLevelFn(Object.values(combinedCounts));
  const totalContributions = Object.values(combinedCounts).reduce((sum, count) => sum + count, 0);

  const startSunday = new Date(from);
  startSunday.setDate(startSunday.getDate() - startSunday.getDay());

  const weeks: Array<{
    firstDay: string;
    days: Array<{
      date: string;
      count: number;
      weekday: number;
      level: number;
      sourceCounts: Record<SourceName, number>;
    }>;
  }> = [];

  for (let weekStart = new Date(startSunday); weekStart <= to; weekStart.setDate(weekStart.getDate() + 7)) {
    const days: Array<{
      date: string;
      count: number;
      weekday: number;
      level: number;
      sourceCounts: Record<SourceName, number>;
    }> = [];

    for (let weekday = 0; weekday < 7; weekday += 1) {
      const dayDate = new Date(weekStart);
      dayDate.setDate(weekStart.getDate() + weekday);
      const key = formatDate(dayDate);
      const count = combinedCounts[key] ?? 0;

      days.push({
        date: key,
        count,
        weekday,
        level: levelForCount(count),
        sourceCounts: {
          github: sourceMaps.github[key] ?? 0,
          leetcode: sourceMaps.leetcode[key] ?? 0,
          codeforces: sourceMaps.codeforces[key] ?? 0,
        },
      });
    }

    weeks.push({
      firstDay: formatDate(weekStart),
      days,
    });
  }

  return NextResponse.json({
    totalContributions,
    sourceTotals,
    weeks,
  });
}
