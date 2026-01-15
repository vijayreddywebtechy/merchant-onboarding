"use client";

import React from "react";
import { useForm, FormProvider, Resolver, DefaultValues, Mode } from "react-hook-form";

interface RHFProviderProps<T extends Record<string, any>> {
  children: React.ReactNode;
  submitFn?: (data: T) => void;
  resolver?: Resolver<T>;
  defaultValues?: DefaultValues<T>;
  mode?: Mode;
  onMount?: (reset: () => void) => void;
}

const RHFProvider = <T extends Record<string, any>>({
  children,
  submitFn = () => {},
  resolver,
  defaultValues = {} as DefaultValues<T>,
  mode = "onChange",
  onMount,
}: RHFProviderProps<T>) => {
  const methods = useForm<T>({
    resolver,
    defaultValues,
    mode,
  });

  React.useEffect(() => {
    if (onMount) {
      onMount(methods.reset);
    }
  }, [onMount, methods.reset]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(submitFn as any)}>{children}</form>
    </FormProvider>
  );
};

export default RHFProvider;