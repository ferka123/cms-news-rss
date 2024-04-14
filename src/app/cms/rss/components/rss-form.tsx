"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { RssForm, RssFormSchema, RssFormUpdateSchema } from "@/lib/rss/schema";
import MultipleSelector from "@/components/ui/composed/multiselect";
import { getTagAutocomplete } from "@/lib/tags/actions";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { rssMapKeyOptions } from "@/lib/rss/data";
import { createSource, updateSource } from "@/lib/rss/actions";
import { toast } from "sonner";

type Props = { defaultValues: RssForm; isModal?: boolean };

const SourceForm = ({ defaultValues, isModal }: Props) => {
  const form = useForm<RssForm>({
    resolver: zodResolver(
      defaultValues.id ? RssFormUpdateSchema : RssFormSchema
    ),
    defaultValues,
  });

  const { fields, append } = useFieldArray({
    name: "custom_fields",
    control: form.control,
  });

  const router = useRouter();

  const submitHandler = async ({ id, ...data }: RssForm) => {
    try {
      const promise = id ? updateSource({ ...data, id }) : createSource(data);
      const result = await promise;

      if (result.serverError) return toast.error(result.serverError);
      if (result.validationErrors)
        return toast.error(
          `Validation errors: ${Object.values(result.validationErrors)
            .flat()
            .join(", ")}`
        );

      toast.success(id ? "Source updated" : "Source added");
      if (isModal) router.back();
      else router.push("/cms/rss");
    } catch {
      toast.error("Coudn't perform this operation");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submitHandler)}>
        <div
          className={cn(
            "space-y-4 p-2",
            isModal && "max-h-[70vh] overflow-y-auto scrollbars"
          )}
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter source name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="src"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Link</FormLabel>
                <FormControl>
                  <Input placeholder="Enter source url" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="interval"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Interval</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter update interval in minutes"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="custom_tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tags</FormLabel>
                <FormControl>
                  <MultipleSelector
                    placeholder="Enter custom tags"
                    creatable
                    onSearch={getTagAutocomplete}
                    value={field.value}
                    onChange={field.onChange}
                    triggerSearchOnFocus
                    hidePlaceholderWhenSelected
                    delay={300}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="should_import_tags"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Import Tags</FormLabel>
                  <FormDescription>
                    If enabled the importer will add tags provided by source
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <div className="flex flex-col gap-2 justify-between rounded-lg border p-4">
            <div>
              <p className="text-sm">Custom Mappings</p>
              <p className="text-sm text-muted-foreground">
                Allows you to map source fields to local fields
              </p>
            </div>
            <div className="flex flex-col gap-2">
              {fields.map((field, index) => (
                <React.Fragment key={field.id}>
                  <FormField
                    control={form.control}
                    name={`custom_fields.${index}.mapKey`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel className="sr-only">
                          Custom Mappings
                        </FormLabel>
                        <FormDescription className="sr-only">
                          Select a field to map
                        </FormDescription>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a field to map to" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {rssMapKeyOptions.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex gap-2">
                    <FormField
                      control={form.control}
                      name={`custom_fields.${index}.rssKey`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Map to Element</FormLabel>
                          <FormDescription className="sr-only">
                            Field to map to in rss
                          </FormDescription>
                          <FormControl>
                            <Input
                              placeholder="Enter source field"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`custom_fields.${index}.attr`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Element Attribute</FormLabel>
                          <FormDescription className="sr-only">
                            Additional attribute name to look in source field
                          </FormDescription>
                          <FormControl>
                            <Input
                              placeholder="Enter source field"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Separator className="[&:last-child]:hidden mt-2" />
                </React.Fragment>
              ))}
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => append({ mapKey: "", rssKey: "", attr: "" })}
            >
              Add Custom Mapping
            </Button>
          </div>
          <FormField
            control={form.control}
            name="paused"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Pause Importing</FormLabel>
                  <FormDescription>
                    If enabled the importer will not start working right away
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <div className="flex gap-2 mt-5 mx-2 justify-end">
          <Button
            type="button"
            variant={"secondary"}
            onClick={() => router.back()}
          >
            Close
          </Button>
          <Button type="submit">{defaultValues.id ? "Update" : "Add"}</Button>
        </div>
      </form>
    </Form>
  );
};

export default SourceForm;
