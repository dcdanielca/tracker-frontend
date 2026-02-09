interface FormErrorProps {
  message?: string;
}

export function FormError({ message }: FormErrorProps) {
  if (!message) return null;

  return (
    <div className="rounded-lg bg-red-50 p-4 text-sm text-red-800">
      <p>{message}</p>
    </div>
  );
}
