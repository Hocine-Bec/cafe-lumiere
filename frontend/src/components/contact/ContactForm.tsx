import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { CheckCircle } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { contactMessagesApi } from '@/services/api';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';

type ContactFormData = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export function ContactForm() {
  const { t } = useLanguage();
  const [success, setSuccess] = useState(false);

  const schema = useMemo(() =>
    z.object({
      name: z.string().min(1, t('contact.nameRequired')).max(200),
      email: z.string().min(1, t('contact.emailRequired')).check(z.email({ error: t('contact.emailInvalid') })).max(200),
      subject: z.string().min(1, t('contact.subjectRequired')).max(300),
      message: z.string().min(1, t('contact.messageRequired')).max(5000),
    }),
  [t]);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactFormData>({
    resolver: zodResolver(schema),
  });

  const { mutate, isPending, isError } = useMutation({
    mutationFn: contactMessagesApi.create,
    onSuccess: () => {
      setSuccess(true);
      reset();
    },
  });

  const onSubmit = (data: ContactFormData) => mutate(data);

  if (success) {
    return (
      <div className="flex flex-col items-center gap-4 py-12 text-center">
        <CheckCircle className="h-14 w-14 text-success" />
        <h3 className="font-serif text-2xl font-semibold text-charcoal">{t('contact.success')}</h3>
        <p className="text-warm-gray">{t('contact.successMsg')}</p>
        <button
          onClick={() => setSuccess(false)}
          className="mt-2 text-sm text-copper hover:underline"
        >
          {t('contact.sendAnother')}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <Input
        id="name"
        label={t('contact.nameLabel')}
        placeholder={t('contact.placeholderName')}
        error={errors.name?.message}
        {...register('name')}
      />
      <Input
        id="email"
        label={t('contact.emailLabel')}
        type="email"
        placeholder={t('contact.placeholderEmail')}
        error={errors.email?.message}
        {...register('email')}
      />
      <Input
        id="subject"
        label={t('contact.subjectLabel')}
        placeholder={t('contact.placeholderSubject')}
        error={errors.subject?.message}
        {...register('subject')}
      />
      <Textarea
        id="message"
        label={t('contact.messageLabel')}
        placeholder={t('contact.placeholderMessage')}
        rows={5}
        error={errors.message?.message}
        {...register('message')}
      />

      {isError && (
        <p className="text-sm text-error">{t('contact.errorMsg')}</p>
      )}

      <Button type="submit" isLoading={isPending} size="lg">
        {t('contact.sendMessage')}
      </Button>
    </form>
  );
}
