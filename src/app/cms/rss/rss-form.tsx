import { Button } from "@/components/ui/button";
import { ComboboxDemo } from "@/components/ui/composed/combobox";
import { rssListMapper } from "@/lib/rss/mappers";
import { getRssList } from "@/lib/rss/queries";
import React from "react";

const RssForm = async () => {
  const rss = await getRssList().then((list) => list.map(rssListMapper));

  return (
    <div>
      <p>RSS Source</p>
      <div className="flex gap-2">
        <ComboboxDemo options={rss} />
        <Button>Add new</Button>
      </div>
    </div>
  );
};

export default RssForm;
