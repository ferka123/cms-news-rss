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
import { Controller, useForm } from "react-hook-form";
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
import ImageUpload from "@/components/ui/composed/image-upload";
import {
  PromoFormData,
  PromoFormSchema,
  PromoFormUpdateSchema,
} from "@/lib/promos/schema";
import { promoPagePlacementOptions, promoTypeOptions } from "@/lib/promos/data";
import Combobox from "@/components/ui/composed/combobox";
import { newsLoader, tagLoader } from "@/lib/common/option-loaders";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import NumField from "@/components/ui/composed/numfield";
import { createPromo, updatePromo } from "@/lib/promos/actions";

type Props = { defaultValues: PromoFormData; isModal?: boolean };

const PromoForm = ({ defaultValues, isModal }: Props) => {
  const form = useForm<PromoFormData>({
    resolver: zodResolver(
      defaultValues.id ? PromoFormUpdateSchema : PromoFormSchema
    ),
    defaultValues,
    shouldUnregister: false,
  });

  const router = useRouter();

  const submitHandler = async ({ id, ...data }: PromoFormData) => {
    try {
      const promise = id ? updatePromo({ ...data, id }) : createPromo(data);
      toast.promise(promise, {
        loading: id ? "Updating Promo..." : "Creating Promo...",
        success: (result) => {
          if (result.serverError) throw new Error(result.serverError);
          if (result.validationErrors)
            throw new Error(
              `Validation errors: ${Object.values(result.validationErrors)
                .flat()
                .join(", ")}`
            );
          if (isModal) router.back();
          else router.push("/cms/promos");
          return id
            ? "Promo updated successfully"
            : "Promo created successfully";
        },
        error: (e) => e?.message || "Couldn't perform this operation",
      });
    } catch {
      toast.error("Coudn't perform this operation");
    }
  };

  const type = form.watch("type");
  const placement = form.watch("page_placement");
  const listPlacement = form.watch("listPlacement");

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
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter promo title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={"type"}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Promo Type</FormLabel>
                <FormDescription className="sr-only">
                  Select a type of promotinal material
                </FormDescription>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select promo type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {promoTypeOptions.map((option) => (
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
          <div className="flex flex-col gap-2 justify-between rounded-lg border p-4">
            <FormLabel>Promo Materials</FormLabel>
            {type === "text" && (
              <>
                <FormField
                  control={form.control}
                  name="text"
                  render={({ field }) => (
                    <FormItem>
                      <FormDescription className="sr-only">
                        Promotion Text
                      </FormDescription>
                      <FormControl>
                        <Textarea
                          rows={4}
                          placeholder="Enter promotional text"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex gap-4 w-full">
                  <FormField
                    control={form.control}
                    name="href_text"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Link Text</FormLabel>
                        <FormDescription className="sr-only">
                          Promotional Link Text
                        </FormDescription>
                        <FormControl>
                          <Input placeholder="Enter link text" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="href"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Link Url</FormLabel>
                        <FormDescription className="sr-only">
                          Promotion link URL
                        </FormDescription>
                        <FormControl>
                          <Input placeholder="Enter link url" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </>
            )}
            {type === "image" && (
              <>
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
                  name="href"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Image Link Url</FormLabel>
                      <FormDescription className="sr-only">
                        Image URL
                      </FormDescription>
                      <FormControl>
                        <Input placeholder="Enter image link url" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            {type === "news" && (
              <FormField
                control={form.control}
                name="news"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormDescription>News Publication</FormDescription>
                    <FormControl>
                      <Combobox
                        placeholder="Select news publication"
                        {...field}
                        loader={newsLoader}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
          <FormField
            control={form.control}
            name={"page_placement"}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Promo Placement</FormLabel>
                <FormDescription className="sr-only">
                  Select promo placement type
                </FormDescription>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select promo placement" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {promoPagePlacementOptions.map((option) => (
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
          {(placement === "list" || placement === "both") && (
            <div className="flex flex-col gap-2 justify-between rounded-lg border p-4">
              <FormLabel>List Placement Page</FormLabel>
              <Controller
                control={form.control}
                name="listPlacement"
                render={({ field: { onChange, value } }) => (
                  <ToggleGroup
                    className="self-start py-1"
                    type="single"
                    value={value || "main"}
                    onValueChange={onChange}
                  >
                    <ToggleGroupItem
                      value="main"
                      aria-label="Toggle main page placement"
                    >
                      Main Page
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      value="tag"
                      aria-label="Toggle filter by tag"
                    >
                      Filter by tag
                    </ToggleGroupItem>
                  </ToggleGroup>
                )}
              />
              {listPlacement === "tag" && (
                <FormField
                  control={form.control}
                  name="filter_tag"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Tag</FormLabel>
                      <FormDescription className="sr-only">
                        Filter By tag
                      </FormDescription>
                      <FormControl>
                        <Combobox
                          placeholder="Select Tag"
                          {...field}
                          loader={tagLoader}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <FormField
                control={form.control}
                name="pagination_priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority (0-100)</FormLabel>
                    <FormDescription className="sr-only">
                      Set priority for promo placement
                    </FormDescription>
                    <FormControl>
                      <NumField
                        minValue={0}
                        maxValue={100}
                        allowEmpty
                        placeholder="Enter placememnt priority"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
          {(placement === "search" || placement === "both") && (
            <div className="flex flex-col gap-2 justify-between rounded-lg border p-4">
              <FormLabel>Search Regexp</FormLabel>
              <FormField
                control={form.control}
                name="search_regexp"
                render={({ field }) => (
                  <FormItem>
                    <FormDescription>
                      Regular expression will match against search term
                    </FormDescription>
                    <FormControl>
                      <Input
                        placeholder="Enter regular expression"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
          <div className="flex flex-col gap-2 justify-between rounded-lg border p-4">
            <FormField
              control={form.control}
              name="position_priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Position on Page (0-100)</FormLabel>
                  <FormDescription>
                    Set priority for position on page
                  </FormDescription>
                  <FormControl>
                    <NumField
                      minValue={0}
                      maxValue={100}
                      allowEmpty
                      placeholder="Enter position priority"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="flex gap-2 mt-5 mx-2 justify-end">
          <Button
            type="button"
            variant={"secondary"}
            onClick={() => (isModal ? router.back() : router.push("/cms/news"))}
          >
            {isModal ? "Cancel" : "Back"}
          </Button>
          <Button type="submit">
            {defaultValues.id ? "Update" : "Publish"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PromoForm;
