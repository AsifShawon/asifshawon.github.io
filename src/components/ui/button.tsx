import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  // The shared shadcn `--ring` token is never defined in this project, so the
  // focus ring is declared with the Mint Ledger focus colour (Accessible
  // Indigo) instead of `ring-ring`. `motion-safe:` gates the hover lift so
  // reduced-motion users still get the colour change without the movement.
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[color,background-color,border-color,box-shadow,transform] duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ml-indigo)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ml-canvas)] disabled:pointer-events-none disabled:opacity-50 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",

        /* ------------------------------------------------ Mint Ledger system
           Three intents, matched to the new pill-shaped, green/ink identity.
             brand   — primary CTA (Send Message, Contact Me)
             surface — secondary (Resume, GitHub, external project links)
             quiet   — ghost/text, for low-priority actions              */
        brand:
          "rounded-full bg-[var(--ml-green)] text-[var(--ml-canvas)] shadow-[var(--ml-shadow-sm)] hover:bg-[#0D6B56] motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-[var(--ml-shadow-md)] active:translate-y-px active:bg-[#0B5C4A]",
        surface:
          "rounded-full border border-[var(--ml-ink)] bg-transparent text-[var(--ml-ink)] hover:bg-[var(--ml-mist)] motion-safe:hover:-translate-y-0.5 active:translate-y-px",
        quiet:
          "rounded-full text-[var(--ml-sage)] hover:bg-[rgba(15,124,99,0.08)] hover:text-[var(--ml-ink)] active:translate-y-px",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
        /* Comfortable 44px target for the portfolio's CTAs and form submits. */
        cta: "h-11 rounded-[0.7rem] px-5 text-[0.9375rem]",
        ctaSm: "h-10 rounded-[0.65rem] px-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
