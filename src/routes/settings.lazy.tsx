import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { engineTypes } from "@/sdk/constants";
import { engineStoreSelectors } from "@/store/engine";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/settings")({
  component: Settings,
});

function Settings() {
  return (
    <div className="p-4 flex flex-col gap-2 h-full min-h-0">
      <div className="w-full flex justify-between">
        <p className="font-semibold text-xl">Settings</p>
      </div>

      <p className="font-semibold text-lg">Engine</p>
      <EngineSettings />
    </div>
  );
}

const EngineSettings = () => {
  const apiBase = engineStoreSelectors.use.apiBase();
  const updateApiBase = engineStoreSelectors.use.updateApiBase();

  const engineType = engineStoreSelectors.use.engine();

  return (
    <div className="flex w-full flex-col max-w-lg flex-1 gap-4">
      <div className="rounded-md border px-4 py-2 text-sm shadow-sm flex gap-6 justify-center flex-col">
        <p className="font-semibold">Type</p>
        <RadioGroup
          className="flex gap-4 w-fit"
          defaultValue={engineType}
          value={engineType}
          disabled
        >
          {engineTypes.map((engine) => (
            <div key={engine}>
              <RadioGroupItem
                value={engine}
                id={engine}
                className="peer sr-only"
              />
              <Label
                htmlFor={engine}
                className="cursor-pointer px-3 py-2 rounded-md border-2 border-muted bg-popover hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                {engine}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div className="rounded-md border px-4 py-2 text-sm shadow-sm flex gap-2 justify-center flex-col">
        <p className="font-semibold">Api Base</p>
        <Input
          value={apiBase}
          onChange={(e) => {
            e.preventDefault();
            updateApiBase(e.target.value);
          }}
        />
      </div>
    </div>
  );
};
