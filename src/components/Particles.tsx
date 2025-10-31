import React from "react";
import Particles from "react-tsparticles";

const CustomParticles = ({
	color = "#1c0037",
	clickable = true,
	opacity = 0.05,
}: {
	color?: string;
	clickable?: boolean;
	opacity?: number;
}) => {
	return (
		<Particles
			id="tsparticles"
			options={{
				background: {
					color: {
						value: color,
					},
				},
				fpsLimit: 120,
				interactivity: {
					events: {
						onClick: {
							enable: clickable,
							mode: "push",
						},
						onHover: {
							enable: true,
						},
						resize: true,
					},
					modes: {
						bubble: {
							distance: 400,
							duration: 2,
							opacity: opacity,
							size: 40,
						},
						push: {
							quantity: 4,
						},
						repulse: {
							distance: 200,
							duration: 0.4,
						},
					},
				},
				particles: {
					color: {
						value: "#ffffff",
					},
					links: {
						color: "#ffffff",
						distance: 150,
						enable: true,
						opacity: opacity,
						width: 1,
					},
					collisions: {
						enable: true,
					},
					move: {
						direction: "none",
						enable: true,
						outMode: "bounce",
						random: false,
						speed: 0.1,
						straight: false,
					},
					number: {
						density: {
							enable: true,
							area: 800,
						},
						value: 80,
					},
					opacity: {
						value: opacity,
					},
					shape: {
						type: "circle",
					},
					size: {
						random: true,
						value: 5,
					},
				},
				detectRetina: true,
			}}
		/>
	);
};

export default CustomParticles;
