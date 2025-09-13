import { Label } from './label';
import { Input } from './input';
import { Textarea } from './textarea';
import { cn } from '@/lib/utils';

interface FormFieldProps {
  label: string;
  id: string;
  type?: 'text' | 'email' | 'password' | 'url' | 'textarea';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  className?: string;
  rows?: number;
}

export function FormField({
  label,
  id,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  error,
  className,
  rows = 3,
}: FormFieldProps) {
  const inputProps = {
    id,
    value,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      onChange(e.target.value),
    placeholder,
    required,
    disabled,
    className: cn(
      error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
      className
    ),
  };

  return (
    <div className='space-y-2'>
      <Label htmlFor={id} className={error ? 'text-red-700' : ''}>
        {label}
        {required && <span className='text-red-500 ml-1'>*</span>}
      </Label>
      {type === 'textarea' ? (
        <Textarea {...inputProps} rows={rows} />
      ) : (
        <Input {...inputProps} type={type} />
      )}
      {error && <p className='text-sm text-red-600'>{error}</p>}
    </div>
  );
}
