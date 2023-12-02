export default function SendIcon({ className }: { className?: string }) {
    return (
        <>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={className}
            >
                <path d="m3 3 3 9-3 9 19-9Z" />
                <path d="M6 12h16" />
            </svg>
        </>
    );
}
