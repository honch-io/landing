import { Badge, type BadgeProps } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type PropertyType =
  | "String"
  | "Numeric"
  | "Boolean"
  | "Object"
  | "DateTime"
  | "Unknown"

const typeFromValue = (value: unknown): PropertyType => {
  if (value === null || value === undefined) return "Unknown"
  if (typeof value === "boolean") return "Boolean"
  if (typeof value === "number") return "Numeric"
  if (typeof value === "object") return "Object"
  return "String"
}

/**
 * Normalize the many spellings a property type can arrive as into one of our
 * canonical buckets.
 */
const normalizeType = (type: string): PropertyType => {
  switch (type.trim().toLowerCase()) {
    case "string":
    case "str":
    case "text":
      return "String"
    case "number":
    case "numeric":
    case "int":
    case "integer":
    case "float":
    case "double":
    case "decimal":
      return "Numeric"
    case "boolean":
    case "bool":
      return "Boolean"
    case "object":
    case "json":
    case "array":
    case "list":
      return "Object"
    case "datetime":
    case "date":
    case "time":
    case "timestamp":
      return "DateTime"
    default:
      return "Unknown"
  }
}

const variantMap: Record<
  PropertyType,
  "outline" | "warning" | "info" | "success" | "secondary"
> = {
  String: "outline",
  Numeric: "warning",
  Boolean: "info",
  Object: "success",
  DateTime: "info",
  Unknown: "secondary",
}

const compactLabelMap: Record<PropertyType, string> = {
  String: "S",
  Numeric: "N",
  Boolean: "B",
  Object: "O",
  DateTime: "D",
  Unknown: "?",
}

const compactStyleMap: Record<PropertyType, string> = {
  String: "border-purple-500 text-purple-500",
  Numeric: "border-amber-600 text-amber-600",
  Boolean: "border-blue-500 text-blue-500",
  Object: "border-teal-500 text-teal-500",
  DateTime: "border-rose-500 text-rose-500",
  Unknown: "border-neutral-400 text-neutral-400",
}

interface PropertyTypeBadgeProps {
  type?: string
  value?: unknown
  compact?: boolean
  size?: BadgeProps["size"]
  variant?: BadgeProps["variant"]
  className?: string
}

export function PropertyTypeBadge({
  type,
  value,
  compact,
  size = "default",
  variant,
  className,
}: PropertyTypeBadgeProps) {
  const resolved: PropertyType =
    type != null ? normalizeType(type) : typeFromValue(value)

  if (compact) {
    return (
      <span
        className={cn(
          compactStyleMap[resolved],
          "inline-flex size-4.5 shrink-0 items-center justify-center rounded border bg-transparent font-bold text-[10px] leading-none",
          className,
        )}
      >
        {compactLabelMap[resolved]}
      </span>
    )
  }

  return (
    <Badge variant={variant ?? variantMap[resolved]} size={size} className={className}>
      {resolved}
    </Badge>
  )
}
