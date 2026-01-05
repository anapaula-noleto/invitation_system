// UI Components - Reusable components following best practices
// Each component is accessible, typed, and follows consistent patterns

export { Button } from './Button';
export type { ButtonProps, ButtonVariant, ButtonSize } from './Button';

export { FormInput } from './FormInput';
export type { FormInputProps } from './FormInput';

export { FormSelect } from './FormSelect';
export type { FormSelectProps, SelectOption } from './FormSelect';

export { PhotoUpload } from './PhotoUpload';
export type { PhotoUploadProps } from './PhotoUpload';

export { MultiPhotoUpload } from './MultiPhotoUpload';
export type { MultiPhotoUploadProps, PhotoItem } from './MultiPhotoUpload';

export { IconButton } from './IconButton';
export type { IconButtonProps } from './IconButton';

export { ErrorMessage } from './ErrorMessage';
export type { ErrorMessageProps } from './ErrorMessage';

export { Spinner } from './Spinner';
export type { SpinnerProps } from './Spinner';

export { ToggleButtonGroup } from './ToggleButtonGroup';
export type { ToggleButtonGroupProps } from './ToggleButtonGroup';

export { FormRow } from './FormRow';
export type { FormRowProps } from './FormRow';

export { PaletteSelector } from './PaletteSelector';

export { LanguageSelector } from './LanguageSelector';

export { AITextField } from './AITextField';

export { PlacesAutocomplete } from './PlacesAutocomplete';
export type { PlacesAutocompleteProps, PlaceResult } from './PlacesAutocomplete';

export { Icon } from './Icon';
export type { IconProps, LucideIcon } from './Icon';

// Re-export commonly used icons
export {
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
  MapPin,
  Map,
  Calendar,
  Clock,
  Sparkles,
  Heart,
  Star,
  Gift,
  Music,
  Wine,
  AlertCircle,
  Info,
  CheckCircle,
  Loader2,
  RefreshCw,
  Trash2,
  Edit,
  Eye,
  EyeOff,
  Send,
  Upload,
  Download,
} from './Icon';
