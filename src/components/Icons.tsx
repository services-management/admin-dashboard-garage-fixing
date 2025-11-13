interface IconProps {
  name: string;
  className?: string;
  size?: number;
}

const Icon = ({ name, className = '', size = 20 }: IconProps) => {
  // Map icon names to your SVG files
  const iconMap: Record<string, string> = {
    'service': 'service',
    'booking': 'booking',
    'invoice': 'invoice',
    'notification': 'notification',
    'setting': 'setting',
    'technicians': 'technicians',
    'profile': 'profile',
    'clock': 'clock',
    'calendar': 'calendar',
    'search': 'search',
    'home': 'home',
    'night': 'night',
    'sun': 'sun',
  };

  const iconFile = iconMap[name] || 'Vector';

  return (
    <img 
      src={`/src/assets/icons/${iconFile}.svg`}
      alt={name}
      className={className}
      width={size}
      height={size}
      style={{ display: 'inline-block', verticalAlign: 'middle' }}
    />
  );
};

export default Icon;