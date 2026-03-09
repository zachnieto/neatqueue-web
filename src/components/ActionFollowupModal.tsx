import { useState } from "react";
import {
	type ButtonData,
	type EmbedData,
	type EmbedField,
	type TextInputData,
	useActionFollowup,
} from "../hooks/useActionFollowup";

function stripMarkdown(text: string): string {
	return text
		.replace(/\*\*\*(.+?)\*\*\*/g, "$1")
		.replace(/\*\*(.+?)\*\*/g, "$1")
		.replace(/\*(.+?)\*/g, "$1")
		.replace(/__(.+?)__/g, "$1")
		.replace(/_(.+?)_/g, "$1")
		.replace(/~~(.+?)~~/g, "$1")
		.replace(/`(.+?)`/g, "$1")
		.replace(/^>+\s?/gm, "");
}

const BUTTON_VARIANT: Record<ButtonData["style"], string> = {
	blurple: "btn-action-purple",
	green: "btn-action-green",
	red: "btn-action-red",
	grey: "",
	link: "",
};

function FieldsGrid({ fields }: { fields: EmbedField[] }) {
	return (
		<div
			style={{
				display: "grid",
				gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
				gap: "2px 16px",
			}}
		>
			{fields.map((field, i) => (
				// biome-ignore lint/suspicious/noArrayIndexKey: static embed fields
				<div key={i} style={{ padding: "8px 0" }}>
					<div
						style={{
							fontFamily: "'Rajdhani', sans-serif",
							fontWeight: 700,
							fontSize: 14,
							color: "#e8eaf0",
							letterSpacing: "0.04em",
							textTransform: "uppercase",
						}}
					>
						{stripMarkdown(field.name)}
					</div>
					<div
						style={{
							fontFamily: "'JetBrains Mono', monospace",
							fontSize: 12,
							color: "#5a6078",
							marginTop: 2,
						}}
					>
						{stripMarkdown(field.value)}
					</div>
				</div>
			))}
		</div>
	);
}

function ButtonsBody({
	embed,
	content,
	components,
	onButtonClick,
}: {
	embed?: EmbedData;
	content?: string;
	components: ButtonData[];
	onButtonClick: (customId: string) => void;
}) {
	return (
		<div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
			{content && (
				<p
					style={{
						fontFamily: "'Inter', sans-serif",
						fontSize: 13,
						color: "#9aa0b4",
						lineHeight: 1.6,
						margin: 0,
					}}
				>
					{stripMarkdown(content)}
				</p>
			)}

			{embed?.description && (
				<p
					style={{
						fontFamily: "'Inter', sans-serif",
						fontSize: 13,
						color: "#9aa0b4",
						lineHeight: 1.6,
						margin: 0,
					}}
				>
					{stripMarkdown(embed.description)}
				</p>
			)}

			{embed?.fields && embed.fields.length > 0 && (
				<FieldsGrid fields={embed.fields} />
			)}

			<div
				style={{
					display: "flex",
					flexWrap: "wrap",
					gap: 8,
					paddingTop: 4,
				}}
			>
				{components.map((btn) => (
					<button
						key={btn.custom_id}
						type="button"
						disabled={btn.disabled}
						onClick={() => onButtonClick(btn.custom_id)}
						className={`btn-action ${BUTTON_VARIANT[btn.style] ?? ""}`}
					>
						{btn.emoji ? `${btn.emoji} ${btn.label}` : btn.label}
					</button>
				))}
			</div>
		</div>
	);
}

function TextInputBody({
	textInputs,
	onSubmit,
}: {
	textInputs: TextInputData[];
	onSubmit: (values: Record<string, string>) => void;
}) {
	const [values, setValues] = useState<Record<string, string>>(() =>
		Object.fromEntries(textInputs.map((t) => [t.custom_id, t.value ?? ""])),
	);

	return (
		<div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
			{textInputs.map((input) => (
				<div key={input.custom_id}>
					<label
						htmlFor={`followup-${input.custom_id}`}
						style={{
							display: "block",
							fontFamily: "'Rajdhani', sans-serif",
							fontWeight: 700,
							fontSize: 13,
							color: "#9aa0b4",
							letterSpacing: "0.06em",
							textTransform: "uppercase",
							marginBottom: 6,
						}}
					>
						{input.label}
						{input.required && (
							<span style={{ color: "#ff4757", marginLeft: 4 }}>*</span>
						)}
					</label>
					{input.style === "paragraph" ? (
						<textarea
							id={`followup-${input.custom_id}`}
							className="input-field"
							rows={4}
							placeholder={input.placeholder ?? ""}
							value={values[input.custom_id] ?? ""}
							onChange={(e) =>
								setValues((v) => ({
									...v,
									[input.custom_id]: e.target.value,
								}))
							}
							style={{ resize: "vertical" }}
						/>
					) : (
						<input
							id={`followup-${input.custom_id}`}
							className="input-field"
							type="text"
							placeholder={input.placeholder ?? ""}
							value={values[input.custom_id] ?? ""}
							onChange={(e) =>
								setValues((v) => ({
									...v,
									[input.custom_id]: e.target.value,
								}))
							}
						/>
					)}
				</div>
			))}
			<div
				style={{ display: "flex", justifyContent: "flex-end", marginTop: 4 }}
			>
				<button
					type="button"
					className="btn-action btn-action-green"
					onClick={() => onSubmit(values)}
				>
					SUBMIT
				</button>
			</div>
		</div>
	);
}

export default function ActionFollowupModal() {
	const { followup, handleButtonClick, handleModalSubmit, dismiss } =
		useActionFollowup();

	if (!followup) return null;

	const title = stripMarkdown(
		followup.type === "buttons"
			? (followup.embed?.title ?? "Action Required")
			: followup.title,
	);

	return (
		<>
			<div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
				<div className="relative w-full max-w-lg my-6 mx-auto px-4 modal-enter">
					<div
						className="card-glass panel"
						style={{
							padding: 0,
							borderRadius: "6px",
							background: "rgba(24,24,28,0.97)",
							maxHeight: "90vh",
							display: "flex",
							flexDirection: "column",
						}}
					>
						<div className="panel-accent" />

						{/* Header */}
						<div
							style={{
								display: "flex",
								alignItems: "center",
								justifyContent: "space-between",
								padding: "20px 24px 16px",
								borderBottom: "1px solid rgba(255,255,255,0.06)",
								flexShrink: 0,
							}}
						>
							<h3 className="panel-title" style={{ margin: 0 }}>
								{title}
							</h3>
							<button
								type="button"
								onClick={dismiss}
								style={{
									background: "none",
									border: "none",
									cursor: "pointer",
									color: "#5a6078",
									transition: "color 0.2s",
									padding: 4,
								}}
								onMouseEnter={(e) => {
									e.currentTarget.style.color = "#e8eaf0";
								}}
								onMouseLeave={(e) => {
									e.currentTarget.style.color = "#5a6078";
								}}
							>
								<svg
									width="18"
									height="18"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									aria-hidden
								>
									<title>Close</title>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
							</button>
						</div>

						{/* Body */}
						<div
							style={{
								padding: "20px 24px",
								overflowY: "auto",
								flex: 1,
								minHeight: 0,
							}}
						>
							{followup.type === "buttons" ? (
								<ButtonsBody
									embed={followup.embed}
									content={followup.content}
									components={followup.components}
									onButtonClick={(customId) =>
										handleButtonClick(customId, followup)
									}
								/>
							) : (
								<TextInputBody
									textInputs={followup.textInputs}
									onSubmit={handleModalSubmit}
								/>
							)}
						</div>
					</div>
				</div>
			</div>
			<div className="opacity-60 fixed inset-0 z-40 bg-black" />
		</>
	);
}
