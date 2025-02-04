import "./App.css";

export default function App() {
  return (
    <>
      <div className="flex items-center px-4 py-2 dark:bg-neutral-950 dark:text-white">
        <div className="flex grow items-center gap-x-1">
          <img
            alt="Commandinator Logo"
            src="/logo-round.svg"
            className="size-8"
          />
          <span className="grow">Commandinator</span>
        </div>
        <div>avatar</div>
      </div>
      <div className="h-auto p-2 dark:text-white">
        <span>content</span>
      </div>
    </>
  );
}
