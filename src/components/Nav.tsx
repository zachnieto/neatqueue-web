import { Disclosure } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useHookstate } from "@hookstate/core";
import { useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { discordAuth, endSession } from "../services/server-service";
import globalState from "../state";
import { classNames } from "../util/tailwind";

const navigation = [
	{ name: "Home", href: "/", current: true },
	{
		name: "Invite",
		href: import.meta.env.VITE_DISCORD_INVITE,
		current: false,
		requiresLogin: false,
	},
	{
		name: "Documentation",
		href: "https://docs.neatqueue.com",
		current: false,
		requiresLogin: false,
	},
	{
		name: "Guide",
		href: "/guide",
		current: false,
		requiresLogin: false,
	},
	{
		name: "API",
		href: "https://api.neatqueue.com/docs",
		current: false,
		requiresLogin: false,
	},

	{
		name: "Dashboard",
		href: "/dashboard",
		current: false,
		requiresLogin: true,
	},
	{
		name: "Status",
		href: "/status",
		current: false,
		requiresLogin: false,
	},
	{
		name: "Support Server",
		href: "https://discord.com/invite/2Y4YnV54b5",
		current: false,
		requiresLogin: false,
	},
	{
		name: "Admin",
		href: "/admin",
		current: false,
		requiresLogin: true,
		requiresAdmin: true,
	},
];

export default function Nav() {
	const state = useHookstate(globalState);
	const { user } = state.get();
	const navigate = useNavigate();
	const [searchParams, setSearchParams] = useSearchParams();
	const code = searchParams.get("code");

	const login = () => {
		window.open(import.meta.env.VITE_DISCORD_AUTH, "_self");
	};

	const logout = () => {
		navigate("/");
		endSession();
	};

	useEffect(() => {
		if (code) {
			setSearchParams({});
			discordAuth(code);
		}
	}, []);

	let navBarItems = navigation;

	if (!user) {
		navBarItems = navBarItems.filter((item) => !item.requiresLogin);
	}

	if (!user?.admin) {
		navBarItems = navBarItems.filter((item) => !item.requiresAdmin);
	}

	return (
		<Disclosure as="nav" className="">
			{({ open }) => (
				<>
					<div className="mx-auto max-w-7xl px-2 md:px-6 lg:px-8 w-">
						<div className="relative flex h-16 items-center justify-between">
							<div className="absolute inset-y-0 left-0 flex items-center md:hidden">
								{/* Mobile menu button*/}
								<Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-violet-900 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
									<span className="sr-only">Open main menu</span>
									{open ? (
										<XMarkIcon className="block h-6 w-6" aria-hidden="true" />
									) : (
										<Bars3Icon className="block h-6 w-6" aria-hidden="true" />
									)}
								</Disclosure.Button>
							</div>
							<div className="flex flex-1 items-center justify-center md:items-stretch md:justify-start">
								<div className="hidden md:ml-6 md:block">
									<div className="flex space-x-4 ">
										{navBarItems.map((item) => (
											<a
												key={item.name}
												href={item.href}
												className={classNames(
													item.current
														? " text-white"
														: "text-gray-300 hover:text-white",
													"rounded-md px-3 py-2 text-lg font-medium nav-link relative",
												)}
												aria-current={item.current ? "page" : undefined}
											>
												{item.name}
											</a>
										))}
									</div>
								</div>
							</div>
							<div
								className=" inset-y-0 right-0 flex items-center pr-2 md:static md:inset-auto md:ml-6 md:pr-0"
								onClick={user ? logout : login}
							>
								<a
									className="text-white rounded-md px-3 py-2 text-lg font-medium nav-link relative"
									href="#"
								>
									{user ? "Logout" : "Login"}
								</a>

								{user?.avatar && (
									<img
										className="h-8 w-8 rounded-full"
										src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}`}
										alt=""
									/>
								)}
							</div>
						</div>
					</div>

					<Disclosure.Panel className="md:hidden">
						<div className="space-y-1 px-2 pt-2 pb-3">
							{navigation.map((item) => (
								<Disclosure.Button
									key={item.name}
									as="a"
									href={item.href}
									className={classNames(
										item.current
											? "bg-violet-900 text-white"
											: "text-gray-300 hover:bg-violet-700 hover:text-white",
										"block rounded-md px-3 py-2 text-base font-medium",
									)}
									aria-current={item.current ? "page" : undefined}
								>
									{item.name}
								</Disclosure.Button>
							))}
						</div>
					</Disclosure.Panel>
				</>
			)}
		</Disclosure>
	);
}
