declare module '*.css' {
  const classes: Record<string, string>;
  export default classes;
}

declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.jpeg' {
  const src: string;
  export default src;
}

declare module '*.gif' {
  const src: string;
  export default src;
}

declare module '*.svg' {
  import type { FC, SVGProps } from 'react';
  const src: string;
  export default src;
  export const ReactComponent: FC<SVGProps<SVGSVGElement>>;
}

