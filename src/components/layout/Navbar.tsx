export default function Navbar() {
    return (
        <header className="fixed top-0 z-50 w-full border-b border-white/10 backdrop-blur">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                <h1 className="font-bold tracking-wider">
                    VSTR.OS
                </h1>

                <nav className="flex gap-6 text-sm">
                    <a href="#projects">Projects</a>
                    <a href="#skills">Skills</a>
                    <a href="#contact">Contact</a>
                </nav>
            </div>
        </header>
    );
}