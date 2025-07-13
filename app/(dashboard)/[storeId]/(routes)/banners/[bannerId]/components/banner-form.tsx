'use client';

import * as z from "zod";
import { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import ImageUpload from "@/components/ui/image-upload";
import { Banner } from "@prisma/client";
import { Trash } from "lucide-react";
import AlertModal from "@/components/modals/alert-modal";

interface BannerFormProps {
  initialData: Banner | null;
  cloudName: string;
}

const formSchema = z.object({
  label: z.string().min(1, "Label is required"),
  imageUrl: z.string().min(1, "Image is required"),
});

type BannerFormValues = z.infer<typeof formSchema>;

export const BannerForm: React.FC<BannerFormProps> = ({
  initialData,
  cloudName,
}) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? "Edit Banner" : "New Banner";
  const description = initialData
    ? "Edit the banner"
    : "Create a new banner";
  const toastMessage = initialData ? "Banner updated" : "Banner created";
  const action = initialData ? "Save Changes" : "Create";

  const form = useForm<BannerFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      label: "",
      imageUrl: "",
    },
  });

  const onSubmit = async (data: BannerFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/banners/${params.bannerId}`,
          data
        );
      } else {
        await axios.post(`/api/${params.storeId}/banners`, data);
      }
      router.push(`/${params.storeId}/banners`);
      router.refresh();
      toast.success(toastMessage);
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(
        `/api/${params.storeId}/banners/${params.bannerId}`
      );
      router.push(`/${params.storeId}/banners`);
      router.refresh();
      toast.success("Banner deleted.");
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />

      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
            disabled={loading}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>

      <Separator />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
          <div className="grid grid-cols-2 gap-8">
            {/* Label Field */}
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Banner label"
                      {...field}
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Image Upload Field */}
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => {
                console.log("ImageURL Field render");
                console.log("Image URL:", field.value); // ✅ Debug
                return (
                  <FormItem>
                    <FormLabel>Image</FormLabel>
                    <FormControl>
                      <ImageUpload
                        cloudName={cloudName}
                        value={field.value ? [field.value] : []}
                        onChange={(url) => field.onChange(url)}
                        onRemove={() => field.onChange("")}
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                    {field.value && (
                      <p className="text-sm text-muted-foreground mt-2 break-all">
                        Preview URL: <a href={field.value} target="_blank" className="text-blue-600 underline">{field.value}</a>
                      </p>
                    )}
                  </FormItem>
                );
              }}
            />
          </div>

          <Button disabled={loading} type="submit">
            {action}
          </Button>
        </form>
      </Form>

      <Separator />
    </>
  );
};
