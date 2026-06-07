import {
  CheckCircle,
  Coffee,
  Cpu,
  DownloadSimple,
  Drop,
  Gear,
  Leaf,
  Lightning,
  Moon,
  Power,
  Snowflake,
  Thermometer,
  WifiHigh,
  type Icon,
} from "@phosphor-icons/react"

/* -------------------------------------------------------------------------- */
/*  Lightweight replacement for the platform's `ui/icon-picker` getPhosphorIcon.*/
/*  The real one does `import * as PhosphorIcons` (the entire barrel) to build  */
/*  a registry of every icon — fine in the app, far too heavy for a landing    */
/*  bundle. Our mock data only references a handful of icons, so we map just    */
/*  those by name.                                                             */
/* -------------------------------------------------------------------------- */

const ICONS: Record<string, Icon> = {
  Coffee,
  CheckCircle,
  Cpu,
  DownloadSimple,
  Drop,
  Gear,
  Leaf,
  Lightning,
  Moon,
  Power,
  Snowflake,
  Thermometer,
  WifiHigh,
}

export function getPhosphorIcon(name: string): Icon | undefined {
  return ICONS[name]
}
