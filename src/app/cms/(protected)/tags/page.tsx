import React from "react";
import { TagForm } from "./tag-form";

const TagsPage = async () => {
  return (
    <div className="h-full bg-muted/40 p-4">
      <div className="rounded-md border bg-background p-4">
        <div className="mb-4">
          <h2 className="text-2xl font-bold tracking-tight">Tags</h2>
          <p className="text-muted-foreground">Manage News Tags</p>
        </div>
        <TagForm />
      </div>
    </div>
  );
};

export default TagsPage;
