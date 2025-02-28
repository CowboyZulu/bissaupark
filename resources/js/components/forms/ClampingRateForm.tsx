import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ClampingRate, VehicleCategory } from "@/types/vehicle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Link } from "@inertiajs/react";

// Define the form schema with Zod
const formSchema = z.object({
  vehicle_category_id: z.string().min(1, "Vehicle category is required"),
  amount: z.string().min(1, "Amount is required").refine(
    (val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0,
    { message: "Amount must be a positive number" }
  ),
  is_active: z.boolean().default(true),
});

// Define the type for the form values
type FormValues = z.infer<typeof formSchema>;

interface ClampingRateFormProps {
  clampingRate?: ClampingRate;
  vehicleCategories: VehicleCategory[];
  isSubmitting: boolean;
  onSubmit: (data: FormValues) => void;
  cancelHref: string;
  submitLabel: string;
}

export default function ClampingRateForm({
  clampingRate,
  vehicleCategories,
  isSubmitting,
  onSubmit,
  cancelHref,
  submitLabel,
}: ClampingRateFormProps) {
  // Initialize the form with React Hook Form and Zod validation
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      vehicle_category_id: clampingRate?.vehicle_category_id.toString() || "",
      amount: clampingRate?.amount.toString() || "",
      is_active: clampingRate?.is_active ?? true,
    },
  });

  // Handle form submission
  const handleSubmit = (values: FormValues) => {
    onSubmit(values);
  };

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <CardHeader>
            <CardTitle>Clamping Rate Details</CardTitle>
            <CardDescription>
              {clampingRate ? "Edit" : "Create"} a clamping rate for a specific vehicle category.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="vehicle_category_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vehicle Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a vehicle category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {vehicleCategories.map((category) => (
                          <SelectItem key={category.id} value={category.id.toString()}>
                            {category.name}
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
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="Enter amount"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel>Active</FormLabel>
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" asChild>
              <Link href={cancelHref}>Cancel</Link>
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : submitLabel}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
} 