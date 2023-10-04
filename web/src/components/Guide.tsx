import {Link} from "react-router-dom";
import Commands from "./Commands";

import neatqueue from "../assets/neatqueue.svg";
import neatqueuePNG from "../assets/neatqueue.png";
import fileIcon from "../assets/file-icon.svg";


const Guide = () => {
    return (
        <section className="max-w-7xl mx-auto">
            <div className="flex items-center gap-[100px] max-[853px]:flex-col">
                <div className="flex-1 flex flex-col gap-[25px] md:gap-[50px]">
                    <h1 className="md:text-7xl text-5xl font-semibold">
                        Basic NeatQueue Guide
                    </h1>
                    <p className="text-2xl font-light">
                        NeatQueue is a queue bot that allows you to create a queue for your
                        server. This guide will show you the basic commands to set up
                        a queue with this amazing bot.
                    </p>
                    <Link to="https://docs.neatqueue.com" className="w-fit">
                        <button className="flex items-center p-3 cursor-pointer bg-red-700 border-none rounded w-max text-white hover:bg-red-800 transition ease-out duration-300">
                            Documentation
                            <img
                                src={fileIcon}
                                width={15}
                                height={15}
                                className="ml-2"
                                alt="file-icon"
                            />
                        </button>
                    </Link>
                </div>
                <div>
                    <img
                        src={neatqueue}
                        width={500}
                        height={500}
                        className="w-full object-cover hidden md:block"
                        alt="queue"
                    />
                    <img
                        src={neatqueuePNG} // TODO: Update SVG to outline text, to prevent font from changing
                        width={500}
                        height={500}
                        className="w-full object-cover md:hidden"
                        alt="queue-mobile"
                    />
                </div>
            </div>
            {/*<Stats />*/}
            <Commands />
        </section>
    );
}

export default Guide;