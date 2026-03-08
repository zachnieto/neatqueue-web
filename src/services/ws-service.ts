/**
 * Native WebSocket client for queue real-time updates.
 * JSON protocol: { type, data }. Auth via ?token=<jwt> on connect.
 */

import globalState from "../state";

const API_BASE = import.meta.env.VITE_NEATQUEUE_API;
const WS_BASE = API_BASE?.replace(/^http/, "ws") ?? "ws://localhost:5173";

const MAX_RECONNECT_DELAY_MS = 30000;
const INITIAL_RECONNECT_DELAY_MS = 1000;

/** Close codes we use or commonly see. */
const WS_CLOSE_REASONS: Record<number, string> = {
	4001: "Invalid or expired token",
	503: "No backend servers available",
	1011: "Server error",
	1006: "Connection lost (check server is running)",
	1008: "Policy violation",
};

export type WsMessage = { type: string; data?: Record<string, unknown> };

type Listener = (data: Record<string, unknown>) => void;

/** (connected, lastError) - lastError is set when connection closes with an error. */
type ConnectionChangeListener = (
	connected: boolean,
	lastError: string | null,
) => void;

class NeatQueueSocket {
	private ws: WebSocket | null = null;
	private listeners = new Map<string, Set<Listener>>();
	private reconnectDelayMs = INITIAL_RECONNECT_DELAY_MS;
	private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
	private token: string | null = null;
	private serverId: string | null = null;
	private subscribedMatches = new Set<string>();
	private connectionChangeListeners = new Set<ConnectionChangeListener>();
	private _lastError: string | null = null;

	private notifyConnectionChange(
		connected: boolean,
		lastError: string | null | undefined = undefined,
	): void {
		if (lastError !== undefined) this._lastError = lastError;
		for (const listener of this.connectionChangeListeners) {
			listener(connected, this._lastError);
		}
	}

	/** Subscribe to connection state changes (for UI status indicator). Returns unsubscribe function. */
	addConnectionChangeListener(listener: ConnectionChangeListener): () => void {
		this.connectionChangeListeners.add(listener);
		return () => this.connectionChangeListeners.delete(listener);
	}

	/** Last error message from connect/close (e.g. for tooltip). */
	getLastError(): string | null {
		return this._lastError;
	}

	connect(token: string, serverId: string): void {
		if (this.ws?.readyState === WebSocket.OPEN) {
			if (this.token === token && this.serverId === serverId) return;
			this.disconnect();
		}
		this.token = token;
		this.serverId = serverId;
		// Use /queue-ws so cluster manager can proxy (website -> cluster -> backend); backend also serves /queue-ws.
		const url = `${WS_BASE}/queue-ws?token=${encodeURIComponent(token)}&server_id=${encodeURIComponent(serverId)}`;
		this.ws = new WebSocket(url);
		this.ws.onopen = () => {
			this.reconnectDelayMs = INITIAL_RECONNECT_DELAY_MS;
			this._lastError = null;
			this.notifyConnectionChange(true, null);
			this.send("subscribe_server", { server_id: this.serverId });
			for (const key of this.subscribedMatches) {
				const [sid, gameNum] = key.split(":");
				if (sid && gameNum) {
					this.send("subscribe_match", {
						server_id: sid,
						game_num: Number(gameNum),
					});
				}
			}
		};
		this.ws.onmessage = this.handleMessage.bind(this);
		this.ws.onclose = this.handleClose.bind(this);
		this.ws.onerror = () => {
			this._lastError = this._lastError ?? "WebSocket connection error";
			console.warn(
				"[NeatQueue WS] Connection error to",
				url.replace(/\?.*/, ""),
				this._lastError,
			);
		};
	}

	disconnect(): void {
		if (this.reconnectTimer) {
			clearTimeout(this.reconnectTimer);
			this.reconnectTimer = null;
		}
		this.reconnectDelayMs = INITIAL_RECONNECT_DELAY_MS;
		if (this.ws) {
			this.ws.onclose = null;
			this.ws.onmessage = null;
			this.ws.close();
			this.ws = null;
		}
		this.token = null;
		this.serverId = null;
		this._lastError = null;
		this.notifyConnectionChange(false, null);
	}

	private handleMessage(event: MessageEvent): void {
		try {
			const msg = JSON.parse(event.data as string) as WsMessage;
			const { type, data = {} } = msg;

			if ("message" in data) {
				data.message = this.updateContent(data.message as string);
			}

			const set = this.listeners.get(type);
			if (set) for (const cb of set) cb(data as Record<string, unknown>);
			const anySet = this.listeners.get("*");
			if (anySet)
				for (const cb of anySet)
					cb({ type, ...data } as Record<string, unknown>);
		} catch {
			// ignore parse errors
		}
	}

	private handleClose(event: CloseEvent): void {
		const code = event.code;
		const reason = event.reason?.trim() || null;
		const friendly =
			reason ||
			WS_CLOSE_REASONS[code] ||
			(code === 1006
				? "Connection lost (check server is running)"
				: `Connection closed (${code})`);
		this._lastError = friendly;
		this.ws = null;
		this.notifyConnectionChange(false, friendly);
		console.warn("[NeatQueue WS] Disconnected:", code, reason || friendly);
		this.scheduleReconnect();
	}

	private scheduleReconnect(): void {
		if (this.reconnectTimer || !this.token) return;
		this.reconnectTimer = setTimeout(async () => {
			this.reconnectTimer = null;
			const token = this.token ?? globalState.get().auth?.access_token;
			if (!token || !this.serverId) return;
			this.connect(token, this.serverId);
			this.reconnectDelayMs = Math.min(
				this.reconnectDelayMs * 2,
				MAX_RECONNECT_DELAY_MS,
			);
			// Re-subscriptions are handled by the onopen handler in connect()
		}, this.reconnectDelayMs);
	}

	send(type: string, data: Record<string, unknown> = {}): void {
		if (this.ws?.readyState !== WebSocket.OPEN) return;
		this.ws.send(JSON.stringify({ type, data }));
	}

	on(type: string, cb: Listener): () => void {
		if (!this.listeners.has(type)) this.listeners.set(type, new Set());
		const set = this.listeners.get(type);
		if (set) set.add(cb);
		return () => this.listeners.get(type)?.delete(cb);
	}

	get connected(): boolean {
		return this.ws?.readyState === WebSocket.OPEN;
	}

	ensureConnected(serverId: string): boolean {
		if (this.ws?.readyState === WebSocket.OPEN && this.serverId === serverId)
			return true;
		const token = globalState.get().auth?.access_token;
		if (!token) return false;
		this.connect(token, serverId);
		return false;
	}

	subscribeMatch(serverId: string, gameNum: number): void {
		const key = `${serverId}:${gameNum}`;
		this.subscribedMatches.add(key);
		this.send("subscribe_match", { server_id: serverId, game_num: gameNum });
	}

	unsubscribeMatch(serverId: string, gameNum: number): void {
		const key = `${serverId}:${gameNum}`;
		this.subscribedMatches.delete(key);
		this.send("unsubscribe_match", { server_id: serverId, game_num: gameNum });
	}

	joinQueue(
		serverId: string,
		channelId: string,
		role?: string,
		surveyAnswers?: Record<string, unknown>,
	): void {
		this.send("join_queue", {
			server_id: serverId,
			channel_id: channelId,
			...(role != null && { role }),
			...(surveyAnswers != null && { survey_answers: surveyAnswers }),
		});
	}

	leaveQueue(serverId: string, channelId: string): void {
		this.send("leave_queue", { server_id: serverId, channel_id: channelId });
	}

	readyUpMatch(
		serverId: string,
		gameNum: number,
		channelId: string | number,
	): void {
		this.send("ready_up", {
			server_id: serverId,
			game_num: gameNum,
			channel_id: channelId,
		});
	}

	declineMatch(
		serverId: string,
		gameNum: number,
		channelId: string | number,
	): void {
		this.send("decline_match", {
			server_id: serverId,
			game_num: gameNum,
			channel_id: channelId,
		});
	}

	private updateContent(content: string): string {
		return content.replace(/<t:(\d+):R>/g, (_, ts) => {
			const date = new Date(Number(ts) * 1000);
			const now = new Date();

			const diff = Math.abs(date.getTime() - now.getTime());
			const twelveHours = 12 * 60 * 60 * 1000;

			if (diff <= twelveHours) {
				return `at ${date.toLocaleTimeString()}`;
			}

			return `at ${date.toLocaleString()}`;
		});
	}
}

export const wsSocket = new NeatQueueSocket();

export function getWsSocket(): NeatQueueSocket {
	return wsSocket;
}
