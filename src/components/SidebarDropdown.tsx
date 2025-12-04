import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Icon, { IconName } from "../components/Icons";

interface SidebarDropdownProps {
  label: string;
  iconName: IconName;
  items: { to: string; label: string; iconName?: IconName }[];
}

export default function SidebarDropdown({ label, iconName, items }: SidebarDropdownProps) {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <li>
      {/* Parent item looks like a normal NavItem */}
      <div
        className={`sidebar-link ${open ? "active" : ""}`}
        onClick={() => setOpen(!open)}
      >
        <span className="sidebar-icon" aria-hidden="true">
          <Icon name={iconName} size={20} />
        </span>
        <span className="sidebar-label">{label}</span>
      </div>

      {/* Children: smaller + indented */}
      {open && (
        <ul className="ml-6 mt-1 space-y-1">
          {items.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <li key={item.to}>
                <Link to={item.to} className={`sidebar-link ${isActive ? "active" : ""} sidebar-subitem`}>
                {item.iconName && (
                    <span className="sidebar-icon sidebar-subicon" aria-hidden="true">
                    <Icon name={item.iconName} size={16} />
                    </span>
                )}
                <span className="sidebar-label">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </li>
  );
}
