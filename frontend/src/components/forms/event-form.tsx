// FILE: src/components/forms/event-form.tsx
// FILE: src/components/forms/event-form.tsx

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { eventsService } from "@/services/events.service";
import { Event, EventCategory } from "@/types/event.types";

/* ================================
   ZOD SCHEMA
================================ */

const schema = z.object({
  title: z
    .string()
    .min(3, "Minimum 3 characters")
    .max(100, "Maximum 100 characters"),

  description: z
    .string()
    .min(20, "Minimum 20 characters"),

  date: z.string().min(1, "Start date is required"),

  endDate: z.string().min(1, "End date is required"),

  venue: z
    .string()
    .min(2, "Venue is required"),

  city: z
    .string()
    .min(2, "City is required"),

  price: z.coerce
    .number()
    .min(0, "Price cannot be negative"),

  totalCapacity: z.coerce
    .number()
    .min(1, "Capacity must be at least 1"),

  category: z.enum([
    "music",
    "tech",
    "sports",
    "arts",
    "food",
    "business",
    "other",
  ]),

  bannerImage: z.string().optional(),
});

/* ================================
   TYPES
================================ */

type FormData = z.input<typeof schema>;

const CATEGORIES: EventCategory[] = [
  "music",
  "tech",
  "sports",
  "arts",
  "food",
  "business",
  "other",
];

interface EventFormProps {
  existing?: Event;
  onSuccess?: () => void;
}

/* ================================
   COMPONENT
================================ */

export function EventForm({
  existing,
  onSuccess,
}: EventFormProps) {
  const isEditing = Boolean(existing);

  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<FormData>({
    resolver: zodResolver(schema),

    defaultValues: existing
      ? {
          title: existing.title,

          description: existing.description,

          date: existing.date
            ? existing.date.slice(0, 16)
            : "",

          endDate: existing.endDate
            ? existing.endDate.slice(0, 16)
            : "",

          venue: existing.venue,

          city: existing.city,

          price: existing.price
            ? existing.price / 100
            : 0,

          totalCapacity:
            existing.totalCapacity || 100,

          category:
            existing.category || "other",

          bannerImage:
            existing.bannerImage || "",
        }
      : {
          title: "",
          description: "",
          date: "",
          endDate: "",
          venue: "",
          city: "",
          price: 0,
          totalCapacity: 100,
          category: "other",
          bannerImage: "",
        },
  });

  /* ================================
     SUBMIT
  ================================= */

  const onSubmit = async (
    data: FormData,
  ) => {
    try {
      const payload = {
        ...data,
        price: Math.round(data.price * 100),
      };

      if (isEditing && existing) {
        await eventsService.update(
          existing._id,
          payload,
        );

        toast.success("Event updated!");
      } else {
        await eventsService.create(payload);

        toast.success("Event created!");
      }

      onSuccess?.();
    } catch {
      toast.error("Something went wrong");
    }
  };

  /* ================================
     UI
  ================================= */

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4"
    >
      {/* TITLE */}

      <Input
        label="Event Title"
        placeholder="Summer Music Festival"
        error={errors.title?.message}
        {...register("title")}
      />

      {/* DESCRIPTION */}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>

        <textarea
          rows={4}
          placeholder="Describe your event..."
          className="
            w-full
            rounded-xl
            border
            border-gray-300
            px-4
            py-3
            text-sm
            focus:outline-none
            focus:ring-2
            focus:ring-rose-500
          "
          {...register("description")}
        />

        {errors.description && (
          <p className="mt-1 text-sm text-red-500">
            {errors.description.message}
          </p>
        )}
      </div>

      {/* DATES */}

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Start Date"
          type="datetime-local"
          error={errors.date?.message}
          {...register("date")}
        />

        <Input
          label="End Date"
          type="datetime-local"
          error={errors.endDate?.message}
          {...register("endDate")}
        />
      </div>

      {/* VENUE + CITY */}

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Venue"
          placeholder="Grand Hall"
          error={errors.venue?.message}
          {...register("venue")}
        />

        <Input
          label="City"
          placeholder="Mumbai"
          error={errors.city?.message}
          {...register("city")}
        />
      </div>

      {/* PRICE + CAPACITY + CATEGORY */}

      <div className="grid grid-cols-3 gap-4">
        <Input
          label="Price (₹)"
          type="number"
          min={0}
          error={errors.price?.message}
          {...register("price")}
        />

        <Input
          label="Capacity"
          type="number"
          min={1}
          error={errors.totalCapacity?.message}
          {...register("totalCapacity")}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>

          <select
            className="
              w-full
              rounded-xl
              border
              border-gray-300
              px-4
              py-3
              text-sm
              focus:outline-none
              focus:ring-2
              focus:ring-rose-500
            "
            {...register("category")}
          >
            {CATEGORIES.map((category) => (
              <option
                key={category}
                value={category}
              >
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* BANNER */}

      <Input
        label="Banner Image URL"
        placeholder="https://example.com/image.jpg"
        error={errors.bannerImage?.message}
        {...register("bannerImage")}
      />

      {/* SUBMIT */}

      <Button
        type="submit"
        fullWidth
        size="lg"
        isLoading={isSubmitting}
      >
        {isEditing
          ? "Update Event"
          : "Create Event"}
      </Button>
    </form>
  );
}