import Image from "next/image";

export default function Hero() {
    return (
        <section className="flex min-h-screen items-center">
            <div className="mx-auto grid max-w-7xl gap-10 px-6 md:grid-cols-2">

                <div>
                    <p className="mb-4 text-cyan-400">
                        SYSTEM ONLINE
                    </p>

                    <h1 className="mb-4 text-6xl font-bold">
                        Sai Tarun Reddy
                    </h1>

                    <h2 className="mb-6 text-2xl text-slate-300">
                        AI Developer • Full Stack Builder
                    </h2>

                    <p className="max-w-xl text-slate-400">
                        Building intelligent software,
                        developer tools, and ambitious
                        side projects.
                    </p>

                    <div className="mt-8 flex gap-4">
                        <a
                            href="#projects"
                            className="rounded-xl bg-cyan-500 px-5 py-3"
                        >
                            View Projects
                        </a>

                        <a
                            href="/resume.pdf"
                            className="rounded-xl border px-5 py-3"
                        >
                            Resume
                        </a>
                    </div>
                </div>

                <div className="flex justify-center">
                    <Image
                        src="/avatar.png"
                        alt="Avatar"
                        width={350}
                        height={350}
                        className="rounded-3xl border border-cyan-500/30"
                    />
                </div>
            </div>
        </section>
    );
}