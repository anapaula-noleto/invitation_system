'use client';

import { LucideIcon, LucideProps } from 'lucide-react';
import { forwardRef } from 'react';

export interface IconProps extends Omit<LucideProps, 'ref'> {
  /** The Lucide icon component to render */
  icon: LucideIcon;
  /** Size preset or custom size in pixels */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  /** Additional CSS classes for color control (e.g., 'text-gold-500') */
  className?: string;
}

const sizeMap = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
};

/**
 * Icon component wrapper for Lucide icons.
 * 
 * Uses `currentColor` for stroke/fill, allowing color control via CSS classes.
 * 
 * @example
 * ```tsx
 * import { Heart, Star, MapPin } from 'lucide-react';
 * 
 * // Basic usage - inherits text color
 * <Icon icon={Heart} />
 * 
 * // With custom color class
 * <Icon icon={Star} className="text-gold-500" />
 * 
 * // With size preset
 * <Icon icon={MapPin} size="lg" className="text-rose-400" />
 * 
 * // With custom pixel size
 * <Icon icon={Heart} size={28} />
 * ```
 */
export const Icon = forwardRef<SVGSVGElement, IconProps>(
  ({ icon: LucideIcon, size = 'md', className = '', ...props }, ref) => {
    const pixelSize = typeof size === 'number' ? size : sizeMap[size];

    return (
      <LucideIcon
        ref={ref}
        size={pixelSize}
        strokeWidth={1.5}
        className={`icon ${className}`}
        stroke="currentColor"
        fill="none"
        {...props}
      />
    );
  }
);

Icon.displayName = 'Icon';

// Re-export commonly used icons for convenience
export {
  // Navigation & Actions
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  X,
  Check,
  Plus,
  Minus,
  Menu,
  MoreHorizontal,
  MoreVertical,
  
  // Media & Files
  Image,
  Camera,
  Upload,
  Download,
  File,
  Trash2,
  Edit,
  Copy,
  
  // Communication
  Mail,
  Send,
  MessageCircle,
  Heart,
  Star,
  
  // Location & Maps
  MapPin,
  Map,
  Navigation,
  Globe,
  
  // Date & Time
  Calendar,
  Clock,
  
  // UI Elements
  Search,
  Settings,
  User,
  Users,
  Home,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  
  // Status & Feedback
  AlertCircle,
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle,
  Loader2,
  RefreshCw,
  
  // Media Controls
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  
  // Wedding specific
  Sparkles,
  Gift,
  Music,
  Cake,
  Wine,
  PartyPopper,
  Flower2,
  Crown,
  Gem,
  
  // Social
  Share2,
  ExternalLink,
  Link,
  QrCode,
} from 'lucide-react';

// Type export for external use
export type { LucideIcon } from 'lucide-react';
