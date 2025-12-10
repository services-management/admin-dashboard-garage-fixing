import React from 'react';
import {
  RiDashboardLine,
  RiToolsLine,
  RiCalendarLine,
  RiFileListLine,
  RiNotification3Line,
  RiSettings3Line,
  RiUserLine,
  RiSearchLine,
  RiHome5Line,
  RiMoonLine,
  RiSunLine,
  RiTimeLine,
  RiQuestionLine, // fallback icon
  RiShoppingBagLine, // new
  RiBox3Line, // new
  RiSuitcaseLine,
} from 'react-icons/ri';

// Allowed icon names used across the app
export type IconName =
  | 'dashboard'
  | 'services'
  | 'booking'
  | 'invoices'
  | 'notifications'
  | 'settings'
  | 'profile'
  | 'search'
  | 'home'
  | 'night'
  | 'sun'
  | 'clock'
  | 'calendar'
  | 'products'
  | 'box'
  | 'service_package';

interface IconProps {
  name: IconName;
  className?: string;
  size?: number;
}

// Centralized mapping of icon names to components
const iconMap: Partial<
  Record<IconName, React.ComponentType<{ className?: string; size?: number }>>
> = {
  dashboard: RiDashboardLine,
  services: RiToolsLine,
  booking: RiCalendarLine,
  invoices: RiFileListLine,
  notifications: RiNotification3Line,
  settings: RiSettings3Line,
  profile: RiUserLine,
  search: RiSearchLine,
  home: RiHome5Line,
  night: RiMoonLine,
  sun: RiSunLine,
  clock: RiTimeLine,
  calendar: RiCalendarLine,
  products: RiShoppingBagLine,
  box: RiBox3Line,
  service_package: RiSuitcaseLine,
};

// Render the requested icon, with a safe fallback
export default function Icon({ name, className = '', size = 20 }: IconProps) {
  const IconComp = iconMap[name];
  if (!IconComp) {
    console.error(`Icon "${name}" not found in iconMap — rendering fallback.`);
    return <RiQuestionLine className={className} size={size} />;
  }
  return <IconComp className={className} size={size} />;
}
