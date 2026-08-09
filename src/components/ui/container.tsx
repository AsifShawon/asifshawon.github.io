import * as React from "react";

import { cn } from "@/lib/utils";

type ContainerElement = "div" | "header" | "main" | "section" | "footer" | "nav";

interface ContainerProps extends React.HTMLAttributes<HTMLElement> {
  /** Renders a semantic element instead of a `div`. */
  as?: ContainerElement;
  /** `wide` for full-bleed galleries, `narrow` for long-form reading. */
  width?: "default" | "wide" | "narrow";
}

/**
 * The public portfolio's single content wrapper: max-width + auto margins +
 * responsive gutters. Using it for the header as well as page bodies is what
 * keeps the navigation aligned with the content beneath it.
 */
export function Container({
  as: Tag = "div",
  width = "default",
  className,
  ...props
}: ContainerProps) {
  return (
    <Tag
      className={cn(
        "site-container",
        width === "wide" && "site-container--wide",
        width === "narrow" && "site-container--narrow",
        className
      )}
      {...props}
    />
  );
}

export default Container;
