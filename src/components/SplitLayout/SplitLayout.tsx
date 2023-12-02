import styles from "./SplitLayout.module.css";

export default function SplitLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <div className={styles.splitLayout}>{children}</div>;
}
