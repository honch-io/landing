export default function Logo() {
    return (
        <a href="/" className="flex items-center gap-1 cursor-pointer">
            <img src="/icon.svg" alt="Honch Logo" className="w-7 h-7" />
            <span className="text-2xl font-bold tracking-tight">Honch</span>
        </a>
    );
}