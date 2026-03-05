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
	approximate_member_count?: number;
};
export type Auth = { access_token: string } | undefined;
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

export type LoginResponse = {
	access_token: string;
	user: Exclude<User, undefined>;
	guilds: Guild[];
};

export type RefreshResponse = {
	access_token: string;
	user: Exclude<User, undefined>;
	guilds: Guild[];
};

export type SteamAccount = {
	id: string;
	id3: string;
	id_legacy: string;
	username: string;
	avatar: string;
};

export type UserProfile = {
	id: string;
	username: string;
	avatar: string | null;
	discriminator: string;
	admin: boolean;
	premium: boolean;
	steam: SteamAccount | null;
};

export type CommandSectonData = {
	title: string;
	paragraph: unknown;
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

export type Player = {
	name: string;
	id: number;
	mmr: number;
	mmr_change: number;
	team_num: number;
};

export type MatchHistory = {
	game: string;
	time: string;
	teams: Player[][];
	winner: number;
	game_num: number;
	lobby_details: string;
	team_names: string[];
	channel: string;
	queue_channel: string;
};

// Queue / server types for WebSocket and server queues page
export type QueuePlayer = {
	id: string;
	name: string;
	mmr: number;
	role: string | null;
	color?: string | null;
	avatar_url?: string;
	/** ISO timestamp when the player joined the queue */
	timestamp?: string;
	[key: string]: unknown;
};

export type QueueInfo = {
	channel_id: string;
	name: string;
	players: QueuePlayer[];
	queue_size: number;
	locked: boolean;
	roles: string[];
	team_size: number;
	number_of_teams: number;
	current_size?: number;
	hide_names?: boolean;
	test?: boolean;
	guild_id?: string | number;
	[key: string]: unknown;
};

/** Stats returned by GET /api/v2/server/:id (from GuildStats + computed dashboard fields) */
export type ServerQueuesStats = {
	players: number;
	daily_new_players: number;
	monthly_new_players: number;
	queues: number;
	daily_queues: number;
	monthly_queues: number;
	games: number;
	daily_games: number;
	monthly_games: number;
	updated_at: number;
	/** Number of active queues (computed in API). */
	active_queues: number;
	/** Players currently in any queue (computed in API). */
	players_in_queues: number;
};

export type ServerQueuesData = {
	info: {
		id: string;
		name: string;
		icon_url: string | null;
		banner_url?: string | null;
		member_count: number;
	};
	queues: Array<{
		name: string;
		channel: { id: number; name: string };
		players: QueuePlayer[];
	}>;
	channels?: Array<{ id: number; name: string; type: string }>;
	stats?: ServerQueuesStats;
};

export type ChannelRef = {
	id: string | number;
	name: string | null;
	/** "text" (default) or "voice" - controls # vs speaker icon */
	type?: "text" | "voice";
};

export type ActiveMatch = {
	game_num: number;
	stage?: string;
	teams: QueuePlayer[][];
	players?: QueuePlayer[];
	channel?: ChannelRef;
	queue_channel?: ChannelRef;
	voice_channels?: ChannelRef[];
	ready_players?: string[];
	ready_up_mode?: number;
	timer_end?: number;
};
