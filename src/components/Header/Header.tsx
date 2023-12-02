import clsx from "clsx";
import styles from "./Header.module.css";
import Profile from "./Profile/Profile";
import Link from "next/link";

interface Props {
    className?: string;
}

export default function Header({ className }: Props) {
    return (
        <header className={clsx(className, styles.header)}>
            <Link href="/app" className={styles.logoLink}>
                <h1 className={styles.logo}>Chirpy</h1>
            </Link>
            <Profile />
        </header>
    );
}
