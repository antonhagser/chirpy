import clsx from "clsx";
import styles from "./Content.module.css";

interface Props {
    className?: string;
    children?: React.ReactNode;
}

export default function Content({ className, children }: Props) {
    return <div className={clsx(styles.content, className)}>{children}</div>;
}
