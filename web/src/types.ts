export type BotStats = {
	servers: number;
	players: number;
	games: number;
};
export type User =
	| {
			id: string;
			username: string;
			avatar: string;
			discriminator: string;
			admin: boolean;
	  }
	| undefined;
export type Guild = {
	permissions: number;
	name: string;
	icon: string;
	id: string;
};
export type Auth = { token_type: string; access_token: string } | undefined;
export type Plan = {
	price: number;
	details: string;
	max_players: number;
	max_queues: number;
	daily_games: number;
};
export type Plans = { [key: string]: Plan };
export type PremiumData = {
	premium:
		| {
				until: number;
				plan: string;
		  }
		| undefined;
	credits: number;
	plans: Plans;
	occupied: boolean;
};
export type NodeStatus = {
	status: string;
	shards: number;
	guilds: number;
	member_count: number;
	id: number;
};
export type InstancePricing = {
	price: number;
	name: string;
	description: string;
};

export type PrivateInstanceState = "running" | "stopped" | "terminated";

export type PrivateInstance = {
	id: string;
	instance: PrivateInstanceState;
	until: number;
	price: number;
	autoRenew?: boolean;
};

export type TimeLeft = {
	days: number;
	hours: number;
	minutes: number;
	seconds: number;
};

export type Session = {
	auth: Auth;
	user: User;
	guilds: Guild[] | undefined;
	stats: BotStats;
};

export type CommandSectonData = {
	title: string;
	paragraph: any;
	link: string;
};

// New API v2 Types
export type LeaderboardFilters = {
	months: string[];
	include_fields: string[];
	exclude_fields: string[];
};

export type ParsedStats = Record<string, number | null>;

export type PlayerData = {
	mmr: number;
	wins: number;
	losses: number;
	streak: number;
	totalgames: number;
	decay: number;
	ign: string | null;
	peak_mmr: number;
	peak_streak: number;
	rank: number | null;
	winrate: number;
	current_rank: number;
	parsed_stats?: ParsedStats;
};

export type LeaderboardPlayer = {
	id: string;
	name: string;
	avatar_url: string;
	color: number | string;
	data: PlayerData;
	stats: PlayerData; // Alias for backward compatibility
};

export type PaginationInfo = {
	first_page: number;
	previous_page: number | null;
	current_page: number;
	next_page: number | null;
	per_page: number;
	total_pages: number;
	total_items: number;
};

export type MonthData = {
	month: string;
	data: LeaderboardPlayer[];
	pagination: PaginationInfo;
};

export type LeaderboardV2Response = {
	server_id: number;
	channel_id: number;
	queue_name: string;
	filters: LeaderboardFilters;
	available_months: string[];
	months: MonthData[];
};

export type QueueGameStats = Partial<PlayerData> & {
	parsed_stats?: ParsedStats;
	[key: string]: unknown;
};

export type QueueGame = {
	result: string;
	mmr_change: number;
	mmr: number;
	initial_stats?: QueueGameStats;
	updated_stats?: QueueGameStats;
	timestamp: string;
	game_num: number;
	parsed_stats?: ParsedStats;
};

export type QueueGameData = {
	guild_id: number;
	player_id: number;
	queue_name: string;
	games: QueueGame[];
};
