import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { reservationsApi } from '@/services/api';
import { ProgressIndicator } from './ProgressIndicator';
import { DateTimeStep } from './DateTimeStep';
import { GuestDetailsStep } from './GuestDetailsStep';
import { ConfirmationStep } from './ConfirmationStep';
import { ReservationSuccess } from './ReservationSuccess';
import type { ReservationResponse } from '@/types';

// Shared form schema
const schema = z.object({
  date: z.string().min(1, 'Please select a date'),
  time: z.string().min(1, 'Please select a time'),
  partySize: z.number().min(1).max(20),
  customerName: z.string().min(1, 'Name is required').max(200),
  phone: z.string().min(1, 'Phone is required').max(20),
  email: z.string().email('Invalid email').max(200).optional().or(z.literal('')),
  specialRequests: z.string().max(1000).optional(),
});

export type ReservationFormData = z.infer<typeof schema>;

export function ReservationForm() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState<ReservationResponse | null>(null);

  const methods = useForm<ReservationFormData>({
    resolver: zodResolver(schema),
    defaultValues: { partySize: 2 },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: reservationsApi.create,
    onSuccess: (data) => setSubmitted(data),
  });

  const handleNext = async () => {
    let valid = false;
    if (step === 1) {
      valid = await methods.trigger(['date', 'time', 'partySize']);
    } else if (step === 2) {
      valid = await methods.trigger(['customerName', 'phone', 'email', 'specialRequests']);
    }
    if (valid) setStep(s => s + 1);
  };

  const onSubmit = (data: ReservationFormData) => {
    mutate({
      customerName: data.customerName,
      phone: data.phone,
      email: data.email || undefined,
      date: data.date,
      time: data.time,
      partySize: data.partySize,
      specialRequests: data.specialRequests || undefined,
    });
  };

  const reset = () => {
    methods.reset({ partySize: 2 });
    setStep(1);
    setSubmitted(null);
  };

  if (submitted) {
    return <ReservationSuccess reservation={submitted} onReset={reset} />;
  }

  return (
    <FormProvider {...methods}>
      <div className="flex flex-col gap-8">
        <ProgressIndicator currentStep={step} />

        <form onSubmit={methods.handleSubmit(onSubmit)}>
          {step === 1 && <DateTimeStep onNext={handleNext} />}
          {step === 2 && <GuestDetailsStep onBack={() => setStep(1)} onNext={handleNext} />}
          {step === 3 && <ConfirmationStep onBack={() => setStep(2)} isSubmitting={isPending} />}
        </form>
      </div>
    </FormProvider>
  );
}
