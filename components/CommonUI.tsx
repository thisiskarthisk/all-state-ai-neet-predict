// 'use client';

// import { forwardRef } from 'react';
// import { cn } from '@/lib/utils';

// export const Card = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
//   ({ className, ...props }, ref) => (
//     <div
//       ref={ref}
//       className={cn(
//         'bg-white rounded-2xl shadow-lg border border-slate-200/60',
//         className
//       )}
//       {...props}
//     />
//   )
// );
// Card.displayName = 'Card';

// export const CardHeader = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
//   ({ className, ...props }, ref) => (
//     <div ref={ref} className={cn('p-6 pb-0', className)} {...props} />
//   )
// );
// CardHeader.displayName = 'CardHeader';

// export const CardContent = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
//   ({ className, ...props }, ref) => (
//     <div ref={ref} className={cn('p-6', className)} {...props} />
//   )
// );
// CardContent.displayName = 'CardContent';

'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export const Card = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      `
      bg-white/95
      backdrop-blur-xl

      rounded-[32px]

      border
      border-slate-200/70

      shadow-[0_20px_60px_rgba(0,0,0,0.08)]

      transition-all
      duration-300

      `,
      className
    )}
    {...props}
  />
));

Card.displayName = 'Card';

export const CardHeader = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'px-8 pt-8 pb-0',
      className
    )}
    {...props}
  />
));

CardHeader.displayName = 'CardHeader';

export const CardContent = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'p-8',
      className
    )}
    {...props}
  />
));

CardContent.displayName = 'CardContent';