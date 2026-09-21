import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface BreadcrumbNavItem {
  name: string;
  url?: string;
}

interface BreadcrumbNavProps {
  items: BreadcrumbNavItem[];
  className?: string;
}

/**
 * Breadcrumb Navigation Component
 * Displays semantic breadcrumb navigation with proper schema markup support
 */
export function BreadcrumbNav({ items, className = "" }: BreadcrumbNavProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center gap-2 text-sm text-foreground/60 ${className}`}
    >
      <ol className="flex items-center gap-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-2">
            {item.url ? (
              <>
                <Link
                  href={item.url}
                  className="hover:text-orange transition-colors"
                >
                  {item.name}
                </Link>
                {index < items.length - 1 && (
                  <ChevronRight className="w-4 h-4" />
                )}
              </>
            ) : (
              <>
                <span className="text-foreground font-medium">{item.name}</span>
                {index < items.length - 1 && (
                  <ChevronRight className="w-4 h-4" />
                )}
              </>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export default BreadcrumbNav;
