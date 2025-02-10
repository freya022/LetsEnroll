import "./App.css";
import { Link } from "react-router";

export default function Root() {
  return (
    <>
      <div className="flex items-center px-4 py-2 dark:bg-neutral-950">
        <div className="grow">
          <Link to={`/`} className="flex max-w-min items-center gap-x-1">
            <img
              alt="Commandinator Logo"
              src="/logo-round.svg"
              className="size-8 rounded-full"
            />
            <span className="grow">Commandinator</span>
          </Link>
        </div>
        <div>avatar</div>
      </div>
      <div className="h-auto p-2">
        <span>content</span>
      </div>
    </>
  );
}
