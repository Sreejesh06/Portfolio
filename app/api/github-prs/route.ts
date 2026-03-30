import { NextRequest, NextResponse } from "next/server";

type FilterType = "all" | "merged" | "open" | "closed";

const FILTER_TO_STATES: Record<FilterType, string[]> = {
	all: ["OPEN", "CLOSED", "MERGED"],
	merged: ["MERGED"],
	open: ["OPEN"],
	closed: ["CLOSED"],
};

const QUERY = `
	query GetUserPullRequests($login: String!, $states: [PullRequestState!]) {
		user(login: $login) {
			pullRequests(
				first: 100
				orderBy: { field: UPDATED_AT, direction: DESC }
				states: $states
			) {
				nodes {
					id
					number
					title
					url
					state
					createdAt
					mergedAt
					closedAt
					repository {
						nameWithOwner
					}
				}
			}
		}
	}
`;

function toNumericId(nodeId: string, fallback: number): number {
	const match = nodeId.match(/(\d+)$/);
	return match ? Number(match[1]) : fallback;
}

export async function GET(request: NextRequest) {
	const token = process.env.GITHUB_TOKEN;

	if (!token) {
		return NextResponse.json(
			{ error: "Missing GITHUB_TOKEN in environment variables." },
			{ status: 500 },
		);
	}

	const rawFilter = request.nextUrl.searchParams.get("filterType") ?? "all";
	const filterType: FilterType =
		rawFilter === "merged" || rawFilter === "open" || rawFilter === "closed"
			? rawFilter
			: "all";

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
				login: "Sreejesh06",
				states: FILTER_TO_STATES[filterType],
			},
		}),
		cache: "no-store",
	});

	if (!githubResponse.ok) {
		const body = await githubResponse.text();
		return NextResponse.json(
			{ error: "GitHub API request failed.", details: body },
			{ status: githubResponse.status },
		);
	}

	const payload = (await githubResponse.json()) as {
		data?: {
			user?: {
				pullRequests?: {
					nodes?: Array<{
						id: string;
						number: number;
						title: string;
						url: string;
						state: string;
						createdAt: string;
						mergedAt?: string | null;
						closedAt?: string | null;
						repository: {
							nameWithOwner: string;
						};
					}>;
				};
			};
		};
		errors?: Array<{ message: string }>;
	};

	if (payload.errors?.length) {
		return NextResponse.json(
			{ error: "GitHub GraphQL returned errors.", details: payload.errors },
			{ status: 502 },
		);
	}

	const prs = (payload.data?.user?.pullRequests?.nodes ?? []).map((pr) => ({
		id: toNumericId(pr.id, pr.number),
		title: pr.title,
		url: pr.url,
		repository: { nameWithOwner: pr.repository.nameWithOwner },
		state: pr.state,
		createdAt: pr.createdAt,
		mergedAt: pr.mergedAt ?? undefined,
		closedAt: pr.closedAt ?? undefined,
	}));

	return NextResponse.json({ prs });
}
