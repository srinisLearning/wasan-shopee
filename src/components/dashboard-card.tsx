import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

export interface DashboardCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode | LucideIcon;
  color?: string;
  description?: string;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  href?: string;
  className?: string;
  onClick?: () => void;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  icon,
  color = "bg-primary/10 text-primary",
  description,
  trend,
  href,
  className,
  onClick,
}) => {
  const renderIcon = () => {
    if (!icon) return null;

    if (React.isValidElement(icon)) {
      return icon;
    }

    if (typeof icon === "function" || (typeof icon === "object" && icon !== null && "$$typeof" in icon)) {
      const IconComponent = icon as LucideIcon;
      return <IconComponent className="w-5 h-5" />;
    }

    return <span className="text-xl leading-none select-none">{icon}</span>;
  };

  const cardContent = (
    <Card
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-border/60 bg-card/95 backdrop-blur-sm p-6 shadow-sm transition-all duration-300",
        href || onClick
          ? "cursor-pointer hover:shadow-md hover:border-primary/40 hover:-translate-y-0.5 active:translate-y-0"
          : "hover:shadow-sm",
        className
      )}
      onClick={onClick}
    >
      {/* Background soft ambient gradient */}
      <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-primary/5 blur-2xl pointer-events-none group-hover:scale-150 transition-transform duration-500" />

      <CardContent className="p-0 flex items-start justify-between gap-4">
        <div className="space-y-1.5 min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground truncate">
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-mono">
              {value}
            </h3>
            {trend && (
              <span
                className={cn(
                  "text-xs font-semibold px-1.5 py-0.5 rounded-md",
                  trend.isPositive
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                )}
              >
                {trend.value}
              </span>
            )}
          </div>
          {description && (
            <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
              {description}
            </p>
          )}
        </div>

        {icon && (
          <div
            className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-xs transition-transform duration-300 group-hover:scale-110",
              color
            )}
          >
            {renderIcon()}
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (href) {
    return (
      <Link href={href} className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-2xl">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
};

export default DashboardCard;
