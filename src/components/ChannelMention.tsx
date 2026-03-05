/**
 * Discord-style channel mention: pill with # (text) or speaker icon (voice) and channel name.
 * Opens the Discord jump URL when clicked.
 */
/** Speaker with sound waves (voice channel icon) */
const SpeakerIcon = () => (
	<svg
		className="size-3.5 shrink-0"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
		aria-hidden
		role="img"
	>
		<title>Voice channel</title>
		<polygon
			points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"
			fill="currentColor"
			stroke="none"
		/>
		<path d="M15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14" />
	</svg>
);

type ChannelMentionProps = {
	/** Display name of the channel (e.g. "exec") */
	name: string;
	/** Full Discord channel URL to open on click (e.g. https://discord.com/channels/guildId/channelId) */
	jumpUrl: string;
	/** "text" shows #, "voice" shows speaker icon */
	type?: "text" | "voice";
	className?: string;
};

export default function ChannelMention({
	name,
	jumpUrl,
	type = "text",
	className = "",
}: ChannelMentionProps) {
	const isVoice = type === "voice";
	return (
		<a
			href={jumpUrl}
			target="_blank"
			rel="noopener noreferrer"
			className={[
				"inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-sm no-underline",
				"bg-[#303359] text-[#8fb2f5]",
				"hover:bg-[#5865F2] hover:text-white",
				"focus:outline-none focus:ring-2 focus:ring-[#5865F2]/50 focus:ring-offset-1 focus:ring-offset-black/50",
				"cursor-pointer transition-colors",
				className,
			].join(" ")}
			title={isVoice ? `Jump to voice channel ${name}` : `Jump to #${name}`}
		>
			<span className="shrink-0" aria-hidden>
				{isVoice ? <SpeakerIcon /> : "#"}
			</span>
			<span>{name}</span>
		</a>
	);
}
