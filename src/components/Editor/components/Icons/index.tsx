export const AlignLeftIcon = ({ className = "" }) => (
  <svg 
    viewBox="0 0 24 24" 
    className={className}
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2"
  >
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="15" y2="12" />
    <line x1="3" y1="18" x2="18" y2="18" />
  </svg>
);

export const AlignCenterIcon = ({ className = "" }) => (
  <svg 
    viewBox="0 0 24 24" 
    className={className}
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2"
  >
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="6" y1="12" x2="18" y2="12" />
    <line x1="4" y1="18" x2="20" y2="18" />
  </svg>
);

export const AlignRightIcon = ({ className = "" }) => (
  <svg 
    viewBox="0 0 24 24" 
    className={className}
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2"
  >
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="9" y1="12" x2="21" y2="12" />
    <line x1="6" y1="18" x2="21" y2="18" />
  </svg>
);

export const MoreIcon = ({ className = "" }: IconProps) => (
  <svg 
    viewBox="0 0 24 24" 
    className={className}
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="12" cy="12" r="1" fill="currentColor" />
    <circle cx="6" cy="12" r="1" fill="currentColor" />
    <circle cx="18" cy="12" r="1" fill="currentColor" />
  </svg>
); 