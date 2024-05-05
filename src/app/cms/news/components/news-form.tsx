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
import { useForm } from "react-hook-form";
import MultipleSelector from "@/components/ui/composed/multiselect";
import { getTagAutocomplete } from "@/lib/tags/actions";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  NewsForm,
  NewsSchema,
  NewsSchemaUpdateSchema,
} from "@/lib/news/schema";
import { pubStateOptions } from "@/lib/news/data";
import ImageUpload from "@/components/ui/composed/image-upload";
import { createPublication, updatePublication } from "@/lib/news/actions";

type Props = { defaultValues: NewsForm; isModal?: boolean };

const NewsPublicationForm = ({ defaultValues, isModal }: Props) => {
  const form = useForm<NewsForm>({
    resolver: zodResolver(
      defaultValues.id ? NewsSchemaUpdateSchema : NewsSchema
    ),
    defaultValues,
  });

  const router = useRouter();

  const submitHandler = async ({ id, ...data }: NewsForm) => {
    try {
      const promise = id
        ? updatePublication({ ...data, id })
        : createPublication(data);

      toast.promise(promise, {
        loading: id ? "Updating publication..." : "Creating publication...",
        success: (result) => {
          if (result.serverError) throw new Error(result.serverError);
          if (result.validationErrors)
            throw new Error(
              `Validation errors: ${Object.values(result.validationErrors)
                .flat()
                .join(", ")}`
            );
          if (isModal) router.back();
          else router.push("/cms/rss");
          return id
            ? "Publication updated successfully"
            : "Publication created successfully";
        },
        error: (e) => e?.message || "Couldn't perform this operation",
      });
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
            name="media"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormDescription className="sr-only">
                  Image Upload
                </FormDescription>
                <FormControl>
                  <ImageUpload {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter news title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tags</FormLabel>
                <FormDescription className="sr-only">
                  Publication tags
                </FormDescription>
                <FormControl>
                  <MultipleSelector
                    placeholder="Enter publication tags"
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
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Publication Description</FormLabel>
                <FormDescription className="sr-only">
                  Publication description
                </FormDescription>
                <FormControl>
                  <Textarea
                    rows={2}
                    placeholder="Enter description"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Publication Text</FormLabel>
                <FormDescription className="sr-only">
                  Publication text
                </FormDescription>
                <FormControl>
                  <Textarea rows={5} placeholder="Enter text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="pub_state"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Publication Status</FormLabel>
                <FormDescription className="sr-only">
                  Select publication display state
                </FormDescription>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select publication display state" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {pubStateOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
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
          <Button type="submit">
            {defaultValues.id ? "Update" : "Publish"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default NewsPublicationForm;
