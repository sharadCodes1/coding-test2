import { Button } from "./ui/button";

export default function UIDemo() {
  return (
    <div className="flex flex-col items-center gap-4 mt-8">
      <h2 className="text-xl font-bold">shadcn/ui Button Demo</h2>
      <Button variant="default">Default Button</Button>
      <Button variant="outline">Outline Button</Button>
    </div>
  );
}
