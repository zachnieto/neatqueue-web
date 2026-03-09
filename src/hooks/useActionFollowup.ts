import { useCallback, useEffect, useRef, useState } from "react";
import { getWsSocket } from "../services/ws-service";

export type EmbedField = {
	name: string;
	value: string;
	inline?: boolean;
};

export type EmbedData = {
	title?: string;
	description?: string;
	fields?: EmbedField[];
	color?: number;
};

export type ButtonData = {
	custom_id: string;
	label: string;
	style: "blurple" | "grey" | "green" | "red" | "link";
	disabled: boolean;
	emoji?: string | null;
};

export type TextInputData = {
	custom_id: string;
	label: string;
	style: "short" | "paragraph";
	required: boolean;
	placeholder?: string | null;
	value?: string | null;
};

export type ButtonsFollowupState = {
	type: "buttons";
	action: string;
	serverId: string;
	channelId: string;
	gameNum?: number;
	embed?: EmbedData;
	components: ButtonData[];
	content?: string;
};

export type TextInputFollowupState = {
	type: "text_input";
	title: string;
	customId: string;
	textInputs: TextInputData[];
	serverId: string;
};

export type FollowupState =
	| ButtonsFollowupState
	| TextInputFollowupState
	| null;

export function useActionFollowup() {
	const [followup, setFollowup] = useState<FollowupState>(null);
	// Track the current serverId/channelId so button clicks can send the right ids
	const contextRef = useRef<{
		serverId: string;
		channelId: string;
		gameNum?: number;
	} | null>(null);

	useEffect(() => {
		const socket = getWsSocket();

		const unsubFollowup = socket.on(
			"action_followup",
			(data: Record<string, unknown>) => {
				const serverId = String(data.server_id ?? "");
				const channelId = String(data.channel_id ?? "");
				const gameNum =
					data.game_num != null ? Number(data.game_num) : undefined;

				contextRef.current = { serverId, channelId, gameNum };

				setFollowup({
					type: "buttons",
					action: String(data.action ?? ""),
					serverId,
					channelId,
					gameNum,
					embed: data.embed as EmbedData | undefined,
					components: (data.components as ButtonData[]) ?? [],
					content: data.content ? String(data.content) : undefined,
				});
			},
		);

		const unsubModal = socket.on(
			"modal_request",
			(data: Record<string, unknown>) => {
				const ctx = contextRef.current;
				setFollowup({
					type: "text_input",
					title: String(data.title ?? ""),
					customId: String(data.custom_id ?? ""),
					textInputs: (data.text_inputs as TextInputData[]) ?? [],
					serverId: ctx?.serverId ?? "",
				});
			},
		);

		const unsubResult = socket.on(
			"action_result",
			(data: Record<string, unknown>) => {
				// Only close the modal if this result is for the original action
				// (e.g. join_queue), not for an intermediate button_click.
				const resultAction = String(data.action ?? "");
				if (
					resultAction === "button_click" ||
					resultAction === "modal_submit"
				) {
					return;
				}
				setFollowup(null);
				contextRef.current = null;
			},
		);

		return () => {
			unsubFollowup();
			unsubModal();
			unsubResult();
		};
	}, []);

	const handleButtonClick = useCallback(
		(customId: string, fromFollowup?: ButtonsFollowupState) => {
			// Prefer context from the visible followup so we never send with stale/empty refs
			const ctx =
				fromFollowup ??
				(followup?.type === "buttons" ? followup : null) ??
				contextRef.current;
			if (!ctx?.serverId || !ctx?.channelId) return;
			getWsSocket().buttonClick(
				ctx.serverId,
				ctx.channelId,
				customId,
				ctx.gameNum,
			);
		},
		[followup],
	);

	const handleModalSubmit = useCallback(
		(textValues: Record<string, string>) => {
			const ctx = contextRef.current;
			if (!ctx || followup?.type !== "text_input") return;
			getWsSocket().modalSubmit(ctx.serverId, followup.customId, textValues);
		},
		[followup],
	);

	const dismiss = useCallback(() => {
		setFollowup(null);
		contextRef.current = null;
	}, []);

	return { followup, handleButtonClick, handleModalSubmit, dismiss };
}
