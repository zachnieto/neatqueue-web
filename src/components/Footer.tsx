import { useNavigate } from "react-router-dom";

const Footer = () => {
	const navigate = useNavigate();

	return (
		<footer className="rounded-lg shadow">
			<div className="w-full mx-auto p-4 flex items-center justify-end">
				<ul className="flex flex-wrap items-center mt-3 text-gray-300 text-lg font-medium nav-link relative">
					<li>
						<a
							href="#"
							className="rounded-md px-3 py-2"
							onClick={() => navigate("/privacy")}
						>
							Privacy Policy
						</a>
					</li>
				</ul>
			</div>
		</footer>
	);
};

export default Footer;
