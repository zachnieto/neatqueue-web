import { useEffect, useState, useRef } from "react";
import {
	CheckCircleIcon,
	SpeakerWaveIcon,
	SpeakerXMarkIcon,
	UserGroupIcon,
} from "@heroicons/react/24/outline";
import { useReadyUp, useDeclineMatch } from "../../hooks/useQueueActions";
import type { ActiveMatch } from "../../types";
import ChannelMention from "../ChannelMention";
import NumberFlow from "@number-flow/react";

type MatchFoundOverlayProps = {
	match: ActiveMatch;
	serverId: string;
	currentUserId: string;
};

// ReadyUpMode (Matches Python Enum)
// 0: READY_UP_BUTTON
// 1: JOIN_LOBBY_VOICE_CHANNEL

export default function MatchFoundOverlay({
	match,
	serverId,
	currentUserId,
}: MatchFoundOverlayProps) {
	const [timeLeft, setTimeLeft] = useState(0);
	const [isMuted, setIsMuted] = useState(false);
	const readyUp = useReadyUp();
	const declineMatch = useDeclineMatch();
	const audio1Ref = useRef<HTMLAudioElement | null>(null);
	const audio2Ref = useRef<HTMLAudioElement | null>(null);
	const audioToggleRef = useRef(false);

	const timerEnd = match.timer_end ? match.timer_end * 1000 : 0;
	// Calculate total duration roughly assuming it started 5 minutes before timerEnd
	// A better way is passing the orig timeout from backend, but this works for progress bar pct
	const totalDuration = 300 * 1000;
	const fillPct = Math.max(0, Math.min(100, (timeLeft / totalDuration) * 100));

	const readyUpMode = match.ready_up_mode ?? 0;
	const isReady = match.ready_players?.includes(currentUserId) ?? false;
	const readyCount = match.ready_players?.length ?? 0;
	const totalPlayers = match.players?.length ?? 0;
	const readyPct = totalPlayers > 0 ? (readyCount / totalPlayers) * 100 : 0;

	useEffect(() => {
		audio1Ref.current = new Audio("/Clock-tick-1.opus");
		audio2Ref.current = new Audio("/Clock-tick-2.opus");

		// Default volume 30%
		audio1Ref.current.volume = 0.3;
		audio2Ref.current.volume = 0.3;

		// Preload audio
		audio1Ref.current.load();
		audio2Ref.current.load();

		return () => {
			if (audio1Ref.current) audio1Ref.current.pause();
			if (audio2Ref.current) audio2Ref.current.pause();
		};
	}, []);

	useEffect(() => {
		const calculateTimeLeft = () => {
			if (!timerEnd) return 0;
			const now = Date.now();
			return Math.max(0, timerEnd - now);
		};

		setTimeLeft(calculateTimeLeft());

		const interval = setInterval(() => {
			const newTimeLeft = calculateTimeLeft();
			setTimeLeft(newTimeLeft);

			// Play tick sound every second (mute when user has readied up)
			if (
				!isMuted &&
				!isReady &&
				newTimeLeft > 0 &&
				Math.floor(newTimeLeft / 1000) !== Math.floor(timeLeft / 1000)
			) {
				const audioToPlay = audioToggleRef.current
					? audio2Ref.current
					: audio1Ref.current;
				audioToggleRef.current = !audioToggleRef.current;

				if (audioToPlay) {
					audioToPlay.currentTime = 0;
					audioToPlay.play().catch((e) => {
						console.error("Audio play failed:", e);
						if (e.name === "NotAllowedError") {
							setIsMuted(true);
						}
					});
				}
			}
		}, 100);

		return () => clearInterval(interval);
	}, [timerEnd, timeLeft, isMuted, isReady]);

	const handleReadyUp = () => {
		readyUp.mutate({ serverId, gameNum: match.game_num });
	};

	const handleCancel = () => {
		declineMatch.mutate({ serverId, gameNum: match.game_num });
	};

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
			style={{ fontFamily: "'Inter', sans-serif" }}
		>
			<div className="scanline-overlay fixed inset-0 z-[-1] pointer-events-none opacity-50" />

			<div
				className="w-full max-w-md p-8 relative overflow-hidden rounded-md animate-in fade-in zoom-in duration-300"
				style={{
					background: "rgba(10, 12, 16, 0.9)",
					border: "1px solid rgba(0, 180, 255, 0.3)",
					boxShadow:
						"0 0 50px rgba(0, 180, 255, 0.15), inset 0 0 20px rgba(0, 180, 255, 0.05)",
				}}
			>
				{/* Top moving gradient bar */}
				<div
					className="absolute top-0 left-0 h-1 bg-gradient-to-r from-[#00b4ff] to-[#0066cc]"
					style={{ width: `${fillPct}%`, transition: "width 0.1s linear" }}
				/>

				{/* Mute toggle */}
				<button
					type="button"
					onClick={() => setIsMuted(!isMuted)}
					className="absolute top-4 right-4 text-[#7a8099] hover:text-white transition-colors"
					aria-label={isMuted ? "Unmute sounds" : "Mute sounds"}
				>
					{isMuted ? (
						<SpeakerXMarkIcon className="w-5 h-5" />
					) : (
						<SpeakerWaveIcon className="w-5 h-5" />
					)}
				</button>

				<div className="text-center mb-8">
					<h2
						className="text-4xl font-bold mb-2 uppercase"
						style={{
							fontFamily: "'Rajdhani', sans-serif",
							color: "#00b4ff",
							letterSpacing: "0.05em",
							textShadow: "0 0 20px rgba(0, 180, 255, 0.4)",
						}}
					>
						Match Found
					</h2>
					<p className="text-[#9aa0b4] text-sm">
						Queue #{match.game_num} is ready!
					</p>
				</div>

				<div className="flex flex-col items-center justify-center mb-10">
					<div
						className="text-6xl font-black mb-2"
						style={{
							fontFamily: "'JetBrains Mono', monospace",
							color: timeLeft <= 10000 ? "#ff4757" : "#e8eaf0",
							textShadow:
								timeLeft <= 10000 ? "0 0 20px rgba(255, 71, 87, 0.4)" : "none",
							transition: "color 0.3s ease",
						}}
					>
						{<NumberFlow value={Math.ceil(timeLeft / 1000)} />}s
					</div>
					<div className="text-[#5a6078] text-xs font-bold tracking-widest uppercase">
						Remaining Time
					</div>
				</div>

				{/* Ready players count + progress bar */}
				<div className="w-full mb-8">
					<div className="flex items-center justify-between mb-2">
						<div
							className="flex items-center gap-1.5"
							style={{
								fontFamily: "'Inter', sans-serif",
								fontSize: "11px",
								color: "#5a6078",
								letterSpacing: "0.05em",
								textTransform: "uppercase",
							}}
						>
							Ready
						</div>
						<div
							style={{
								fontFamily: "'JetBrains Mono', monospace",
								fontSize: "12px",
								fontWeight: 700,
							}}
						>
							<span
								style={{
									color: readyCount >= totalPlayers ? "#39d98a" : "#00b4ff",
								}}
							>
								{<NumberFlow value={readyCount} />}
							</span>
							<span style={{ color: "#3d4258" }}> / {totalPlayers}</span>
						</div>
					</div>
					<div
						className="rounded-full overflow-hidden"
						style={{ height: "3px", background: "rgba(255,255,255,0.06)" }}
					>
						<div
							style={{
								height: "100%",
								width: `${readyPct}%`,
								background:
									readyCount >= totalPlayers
										? "linear-gradient(90deg, #39d98a, #00cc66)"
										: "linear-gradient(90deg, #00b4ff, #0066cc)",
								borderRadius: "9999px",
								transition: "width 0.6s ease",
							}}
						/>
					</div>
				</div>

				<div className="mt-auto">
					{isReady ? (
						<div className="flex flex-col items-center justify-center py-4 bg-[#39d98a]/10 border border-[#39d98a]/30 rounded text-[#39d98a]">
							<CheckCircleIcon className="w-8 h-8 mb-2" />
							<span
								className="font-bold tracking-wider"
								style={{ fontFamily: "'Rajdhani', sans-serif" }}
							>
								YOU ARE READY
							</span>
							<span className="text-xs opacity-70 mt-1">
								Waiting for other players...
							</span>
						</div>
					) : readyUpMode === 0 ? (
						isReady ? (
							<div className="flex flex-col items-center justify-center py-4 bg-[#39d98a]/10 border border-[#39d98a]/30 rounded text-[#39d98a]">
								<CheckCircleIcon className="w-8 h-8 mb-2" />
								<span
									className="font-bold tracking-wider"
									style={{ fontFamily: "'Rajdhani', sans-serif" }}
								>
									YOU ARE READY
								</span>
								<span className="text-xs opacity-70 mt-1">
									Waiting for other players...
								</span>
							</div>
						) : (
							<button
								type="button"
								className="w-full py-4 rounded text-xl font-bold tracking-widest transition-all duration-300 uppercase relative overflow-hidden group"
								style={{
									background:
										"linear-gradient(135deg, #00b4ff 0%, #0066cc 100%)",
									color: "#fff",
									fontFamily: "'Rajdhani', sans-serif",
									boxShadow: "0 0 20px rgba(0, 180, 255, 0.3)",
								}}
								onClick={handleReadyUp}
								disabled={readyUp.isPending || declineMatch.isPending}
							>
								{/* Shimmer effect */}
								<div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />

								{readyUp.isPending ? "Readying..." : "READY UP!"}
							</button>
						)
					) : (
						<div className="text-center p-6 bg-white/5 border border-white/10 rounded">
							<p className="text-[#e8eaf0] mb-3 leading-relaxed">
								Please join the lobby voice channel to ready up:
							</p>
							{match.voice_channels && match.voice_channels.length > 0 ? (
								<ChannelMention
									jumpUrl={`https://discord.com/channels/${serverId}/${match.voice_channels[0].id}`}
									name={match.voice_channels[0].name || "Lobby"}
									type="voice"
								/>
							) : (
								<span className="text-gray-400 font-mono">
									Channel unavailable
								</span>
							)}
						</div>
					)}

					<button
						type="button"
						className="w-full mt-3 py-3 rounded text-sm font-bold tracking-widest transition-colors duration-300 uppercase border border-[#ff4757]/30 text-[#ff4757] hover:bg-[#ff4757]/10"
						style={{ fontFamily: "'Rajdhani', sans-serif" }}
						onClick={handleCancel}
						disabled={declineMatch.isPending || readyUp.isPending}
					>
						{declineMatch.isPending ? "Canceling..." : "Cancel"}
					</button>
				</div>
			</div>
		</div>
	);
}
