export const TailwindIndicator = () => {
  return (
    <div className="fixed top-0 left-0">
      <span className="hidden dark:block">dark</span>
      <span className="dark:hidden">light</span>
    </div>
  );
};
