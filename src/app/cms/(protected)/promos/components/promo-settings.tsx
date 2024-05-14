import { Button } from "@/components/ui/button";
import NumField from "@/components/ui/composed/numfield";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import type { PromoSettings } from "@/lib/promos/schema";
import { setPromoSettings } from "@/lib/promos/settings";
import { Settings } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export function PromoSettingsForm({ settings }: { settings: PromoSettings }) {
  const methods = useForm<PromoSettings>({ defaultValues: settings });
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const submitHandler = (data: PromoSettings) => {
    if (loading) return;
    setLoading(true);
    toast.promise(setPromoSettings(data), {
      loading: "Saving changes",
      success: (res) => {
        console.log(res.serverError, res.validationErrors);
        if (res.serverError || res.validationErrors) throw new Error();
        setLoading(false);
        setOpen(false);
        return "Changes saved successfully";
      },
      error: () => {
        setLoading(false);
        return "Failed to save changes";
      },
    });
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">
          <Settings />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Promo Settings</DialogTitle>
          <DialogDescription>Make changes to promo settings.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-7 items-center gap-4">
            <Label htmlFor="list_count" className="text-right col-span-3">
              Count per List Page
            </Label>
            <NumField
              id="list_count"
              minValue={0}
              maxValue={10}
              {...methods.register("list_count", { valueAsNumber: true })}
              className="col-span-4"
            />
          </div>
          <div className="grid grid-cols-7 items-center gap-4">
            <Label htmlFor="search_count" className="text-right col-span-3">
              Count per Search Page
            </Label>
            <NumField
              id="search_count"
              minValue={0}
              maxValue={10}
              {...methods.register("search_count", { valueAsNumber: true })}
              className="col-span-4"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            onClick={methods.handleSubmit(submitHandler)}
            disabled={loading}
          >
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
