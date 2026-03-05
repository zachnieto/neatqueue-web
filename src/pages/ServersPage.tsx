import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useHookstate } from "@hookstate/core";
import { parseAsString, useQueryState } from "nuqs";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import ServerCard from "../components/ServerCard";
import Input from "../components/ui/Input";
import PageLayout from "../components/ui/PageLayout";
import SectionHeader from "../components/ui/SectionHeader";
import Select from "../components/ui/Select";
import globalState, { sessionReadyState } from "../state";

const MANAGE_CHANNELS = 0x10;

export default function ServersPage() {
	const state = useHookstate(globalState);
	const ready = useHookstate(sessionReadyState);
	const navigate = useNavigate();
	const { guilds } = state.get();
	const loading = !ready.get() || guilds === undefined;

	const [search, setSearch] = useQueryState(
		"search",
		parseAsString.withDefault(""),
	);
	const [sort, setSort] = useQueryState(
		"sort",
		parseAsString.withDefault("members_desc"),
	);

	const filteredAndSortedGuilds = useMemo(() => {
		if (!guilds) return [];

		let result = [...guilds];

		// Search
		if (search.trim()) {
			const q = search.toLowerCase();
			result = result.filter((g) => g.name.toLowerCase().includes(q));
		}

		// Sort
		result.sort((a, b) => {
			switch (sort) {
				case "name_asc":
					return a.name.localeCompare(b.name);
				case "name_desc":
					return b.name.localeCompare(a.name);
				case "members_asc":
					return (
						(a.approximate_member_count ?? 0) -
						(b.approximate_member_count ?? 0)
					);
				default: // members_desc
					return (
						(b.approximate_member_count ?? 0) -
						(a.approximate_member_count ?? 0)
					);
			}
		});

		return result;
	}, [guilds, search, sort]);

	return (
		<PageLayout>
			<div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-2">
				<SectionHeader
					title="Your Servers"
					subtitle="Select a server to view queues or manage settings."
				/>

				<div className="flex flex-col sm:flex-row gap-3 mb-4 sm:mb-0">
					{/* Search */}
					<div className="relative" style={{ minWidth: 240 }}>
						<MagnifyingGlassIcon
							className="w-[13px] h-[13px] absolute left-[11px] top-1/2 -translate-y-1/2"
							style={{ color: "#5a6078" }}
						/>
						<Input
							type="text"
							placeholder="Search servers..."
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							style={{ paddingLeft: 32 }}
						/>
					</div>

					{/* Sort */}
					<div className="relative" style={{ minWidth: 180 }}>
						<Select value={sort} onChange={(e) => setSort(e.target.value)}>
							<option value="members_desc">MEMBERS (HIGH-LOW)</option>
							<option value="members_asc">MEMBERS (LOW-HIGH)</option>
							<option value="name_asc">NAME (A-Z)</option>
							<option value="name_desc">NAME (Z-A)</option>
						</Select>
					</div>
				</div>
			</div>

			<div
				className="grid gap-4"
				style={{
					gridTemplateColumns:
						"repeat(auto-fill, minmax(min(100%, 300px), 1fr))",
				}}
			>
				{loading
					? Array.from({ length: 12 }, (_, i) => (
							<ServerCard.Skeleton key={`skeleton-${i}`} />
						))
					: filteredAndSortedGuilds.map((guild) => {
							const canManage =
								(guild.permissions & MANAGE_CHANNELS) === MANAGE_CHANNELS;
							const actions = [
								{
									text: "Queues",
									onClick: () => navigate(`/servers/${guild.id}`),
								},
							];
							if (canManage) {
								actions.push({
									text: "Manage",
									onClick: () => navigate(`/manage/${guild.id}`),
								});
							}
							actions.push({
								text: "History",
								onClick: () => navigate(`/history/${guild.id}`),
							});
							return (
								<ServerCard
									key={guild.id}
									id={guild.id}
									name={guild.name}
									icon={guild.icon}
									memberCount={guild.approximate_member_count}
									actions={actions}
								/>
							);
						})}
			</div>
			{!loading && filteredAndSortedGuilds.length === 0 && (
				<p className="section-subtitle mt-8 text-center py-12 card-glass border border-white/5">
					{search.trim()
						? "No servers found matching your search."
						: "You are not in any servers. Join a server with NeatQueue to see it here."}
				</p>
			)}
		</PageLayout>
	);
}
