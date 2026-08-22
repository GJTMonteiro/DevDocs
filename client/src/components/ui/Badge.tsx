import type { ReactNode } from "react";

interface BadgeProps {
    children: ReactNode;
    variant?: "blue" | "green" | "yellow" | "red" | "gray";
}

const Badge = ({
    children,
    variant = "gray",
}: BadgeProps) => {
    return (
        <span className={`ui-badge ui-badge-${variant}`}>
            {children}
        </span>
    );
};

export default Badge;