import Logo from "./Logo";

export default function Navbar() {
    return (
        <div className="flex items-center px-8 py-4 justify-between">
            <Logo />

            {/* <div className="flex items-center gap-4">
                {[
                    { label: 'Product', url: '/product' },
                    { label: 'Docs', url: '/docs' },
                    { label: 'Pricing', url: '/pricing' },
                    { label: 'SDKs', url: '/sdk' },
                ].map((item) => (
                    <button key={item.url} className="transition-colors hover:text-copy-light duration-300 cursor-pointer">
                        <span>{item.label}</span>
                    </button>
                ))}
            </div> */}

            <div className="flex items-center gap-4 font-medium">
                <button className="transition-colors hover:text-copy-light duration-300 cursor-not-allowed">
                    <span>Login</span>
                </button>
                <button className="cursor-not-allowed rounded-full py-1 px-4 bg-primary text-primary-content hover:bg-primary/80 transition-colors duration-200">
                    <span>Get Started</span>
                </button>
            </div>
        </div>
    );
}