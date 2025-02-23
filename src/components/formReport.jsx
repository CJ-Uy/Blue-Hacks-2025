"use client";

import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "./ui/textarea";

import { useRouter } from "next/navigation";
import { useFormStore } from "@/zustand/store";

// This function was partially made with Gen AI
export default function FormReport() {
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      files: [],
      tags: "",
      date: new Date(),
      description: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();

      // Add files to formData if they exist
      if (data.files && data.files.length > 0) {
        const files = data.files;
        for (const file of Array.from(files)) {
          formData.append("files", file);
        }
      }

      formData.append("description", data.description || "");
    //   formData.append("date", data.date ? data.date.toISOString() : "");

      // Store the form data
      useFormStore.getState().setFormData(formData);

      // Navigate to the location selection page
      router.push("/report/selectLocation");
    } catch (error) {
      console.error("Error processing form:", error);
    }
  };

  return (
    <div className="flex w-[100%] h-[100vh] justify-center items-center">
      {/* Rest of your JSX remains the same until the form */}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="files"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex-col w-[100%]">
                    <div className="flex w-[100%] justify-center items-center">
                      <h1 className="text-3xl font-black mb-5">Sinag Report</h1>
                    </div>
                    <div className="flex w-[100%] justify-center items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="5em"
                        height="5em"
                        viewBox="0 0 24 24"
                      >
                        <title>Upload an image here</title>
                        <path
                          fill="currentColor"
                          d="M12 18q2.075 0 3.538-1.462Q17 15.075 17 13q0-2.075-1.462-3.538Q14.075 8 12 8Q9.925 8 8.463 9.462Q7 10.925 7 13q0 2.075 1.463 3.538Q9.925 18 12 18Zm0-2q-1.25 0-2.125-.875T9 13q0-1.25.875-2.125T12 10q1.25 0 2.125.875T15 13q0 1.25-.875 2.125T12 16Zm6-6q.425 0 .712-.288Q19 9.425 19 9t-.288-.713Q18.425 8 18 8t-.712.287Q17 8.575 17 9t.288.712Q17.575 10 18 10ZM4 21q-.825 0-1.412-.587Q2 19.825 2 19V7q0-.825.588-1.412Q3.175 5 4 5h3.15L8.7 3.325q.15-.15.337-.238Q9.225 3 9.425 3h5.15q.2 0 .388.087q.187.088.337.238L16.85 5H20q.825 0 1.413.588Q22 6.175 22 7v12q0 .825-.587 1.413Q20.825 21 20 21Z"
                        />
                      </svg>
                    </div>
                    <Input
                      type="file"
                      accept="image/*"
                      multiple
                      required
                      onChange={(e) => field.onChange(e.target.files)}
                    />
                  </div>
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Provide Description</FormLabel>
                <FormControl>
                  <Textarea maxLength="300" {...field} />
                </FormControl>
                <FormDescription>{field.value.length} of 300</FormDescription>
              </FormItem>
            )}
            required
          />

          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Select Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                        type="button" // Add this to prevent form submission
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </FormItem>
            )}
            required
          />

          <Button type="submit" className="bg-offBlack">
            Select Location
          </Button>
        </form>
      </Form>
    </div>
  );
}