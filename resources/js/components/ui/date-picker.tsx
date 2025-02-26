import * as React from 'react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { FormControl } from './form';
import { Input } from './input';

interface DatePickerProps {
	date: Date | undefined;
	setDate: (date: Date | undefined) => void;
	disabled?: boolean;
	placeholder?: string;
	format?: string;
	className?: string;
}

export function DatePicker({
	date,
	setDate,
	disabled = false,
	placeholder = 'Pick a date',
	format: dateFormat = 'PPP',
	className
}: DatePickerProps) {
	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant={'outline'}
					className={cn(
						'w-full justify-start text-left font-normal',
						!date && 'text-muted-foreground',
						className
					)}
					disabled={disabled}
				>
					<CalendarIcon className="mr-2 h-4 w-4" />
					{date ? format(date, dateFormat) : <span>{placeholder}</span>}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-auto p-0" align="start">
				<Calendar mode="single" selected={date} onSelect={setDate} initialFocus disabled={disabled} />
			</PopoverContent>
		</Popover>
	);
}

interface DatePickerFormFieldProps {
	onChange: (...event: any[]) => void;
	onBlur: () => void;
	value: string;
	name: string;
	disabled?: boolean;
	placeholder?: string;
	className?: string;
}

export function DatePickerFormField({
	onChange,
	onBlur,
	value,
	name,
	disabled,
	placeholder,
	className
}: DatePickerFormFieldProps) {
	const [ date, setDate ] = React.useState<Date | undefined>(value ? new Date(value) : undefined);

	React.useEffect(
		() => {
			if (date) {
				const formattedDate = format(date, 'yyyy-MM-dd');
				onChange(formattedDate);
			} else {
				onChange('');
			}
		},
		[ date, onChange ]
	);

	React.useEffect(
		() => {
			if (value && (!date || format(new Date(value), 'yyyy-MM-dd') !== value)) {
				try {
					setDate(new Date(value));
				} catch (e) {
					setDate(undefined);
				}
			} else if (!value && date) {
				setDate(undefined);
			}
		},
		[ value, date ]
	);

	return (
		<div className="relative">
			<DatePicker
				date={date}
				setDate={setDate}
				disabled={disabled}
				placeholder={placeholder}
				className={className}
			/>
			<Input type="hidden" name={name} value={value} onChange={onChange} onBlur={onBlur} />
		</div>
	);
}
