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
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import ImageUpload from "@/components/ui/composed/image-upload";
import { UserForm, UserSchema, UserUpdateSchema } from "@/lib/user/schema";
import { userRoleOptions, userStateOptions } from "./options-data";
import { createUser, updateUser } from "@/lib/user/actions";
import { ClipboardCopy } from "lucide-react";

type Props = { defaultValues: UserForm; isModal?: boolean };

const UserFormComponent = ({ defaultValues, isModal }: Props) => {
  const form = useForm<UserForm>({
    resolver: zodResolver(defaultValues.id ? UserUpdateSchema : UserSchema),
    defaultValues,
  });

  const router = useRouter();

  const submitHandler = async ({ id, ...data }: UserForm) => {
    try {
      const promise = id ? updateUser({ ...data, id }) : createUser(data);
      toast.promise(promise, {
        loading: id ? "Updating user..." : "Creating user...",
        success: (result) => {
          if (result.serverError) throw new Error(result.serverError);
          if (result.validationErrors)
            throw new Error(
              `Validation errors: ${Object.values(result.validationErrors)
                .flat()
                .join(", ")}`
            );
          if (isModal) router.back();
          else router.push("/cms/users");
          return id ? "User updated successfully" : "User created successfully";
        },
        error: (e) => e?.message || "Couldn't perform this operation",
      });
    } catch {
      toast.error("Coudn't perform this operation");
    }
  };

  const password = form.watch("password");

  const copyPasswordToClipboard = () => {
    toast.promise(navigator.clipboard.writeText(password), {
      loading: "Copying to clipboard...",
      success: "Copied to clipboard",
      error: "Couldn't copy to clipboard",
    });
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
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter user name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Enter user email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div>
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <Input
                        type="password"
                        placeholder="Enter user password"
                        {...field}
                      />
                      {password && (
                        <Button
                          type="button"
                          onClick={copyPasswordToClipboard}
                          variant={"secondary"}
                          size={"icon"}
                        >
                          <ClipboardCopy />
                        </Button>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>User Role</FormLabel>
                <FormDescription className="sr-only">
                  Select user role
                </FormDescription>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select user role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {userRoleOptions.map((option) => (
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
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>User Status</FormLabel>
                <FormDescription className="sr-only">
                  Select user status
                </FormDescription>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select user status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {userStateOptions.map((option) => (
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
            onClick={() =>
              isModal ? router.back() : router.push("/cms/users")
            }
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

export default UserFormComponent;
