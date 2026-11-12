export function Heading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-4 mt-10 text-sm font-medium text-neutral-900 dark:text-neutral-100">
      {children}
    </h2>
  );
}
