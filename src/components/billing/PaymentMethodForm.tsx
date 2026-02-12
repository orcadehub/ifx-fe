import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const cardSchema = z.object({
  cardholderName: z.string().min(3, "Name must be at least 3 characters").max(100, "Name too long"),
  cardNumber: z.string()
    .min(13, "Card number must be at least 13 digits")
    .max(19, "Card number too long")
    .regex(/^\d+$/, "Card number must contain only digits"),
  expirationDate: z.string()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Format must be MM/YY")
    .refine((val) => {
      const [month, year] = val.split('/');
      const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1);
      return expiry > new Date();
    }, "Card has expired"),
  cvv: z.string()
    .min(3, "CVV must be 3 or 4 digits")
    .max(4, "CVV must be 3 or 4 digits")
    .regex(/^\d+$/, "CVV must contain only digits"),
});

type CardFormData = z.infer<typeof cardSchema>;

interface PaymentMethodFormProps {
  defaultValues?: {
    cardholderName: string;
    cardNumber: string;
    expirationDate: string;
  };
  isEdit?: boolean;
  isLoading?: boolean;
  onSubmit: (data: CardFormData) => void;
  onCancel: () => void;
}

export const PaymentMethodForm = ({ 
  defaultValues, 
  isEdit = false,
  isLoading = false, 
  onSubmit, 
  onCancel 
}: PaymentMethodFormProps) => {
  const form = useForm<CardFormData>({
    resolver: zodResolver(cardSchema),
    defaultValues: defaultValues || {
      cardholderName: "",
      cardNumber: "",
      expirationDate: "",
      cvv: "",
    },
  });

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const chunks = cleaned.match(/.{1,4}/g) || [];
    return chunks.join(' ').substring(0, 19);
  };

  const formatExpirationDate = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
    }
    return cleaned;
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="cardholderName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cardholder Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="cardNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Card Number</FormLabel>
              <FormControl>
                <Input
                  placeholder="1234 5678 9012 3456"
                  disabled={isEdit}
                  {...field}
                  onChange={(e) => {
                    const formatted = formatCardNumber(e.target.value);
                    field.onChange(formatted.replace(/\s/g, ''));
                  }}
                  value={isEdit ? field.value : formatCardNumber(field.value)}
                  maxLength={19}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="expirationDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Expiration Date</FormLabel>
                <FormControl>
                  <Input
                    placeholder="MM/YY"
                    {...field}
                    onChange={(e) => {
                      const formatted = formatExpirationDate(e.target.value);
                      field.onChange(formatted);
                    }}
                    maxLength={5}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cvv"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CVV</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="123"
                    {...field}
                    maxLength={4}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button type="submit" className="flex-1" disabled={isLoading}>
            {isLoading ? 'Adding...' : isEdit ? "Save Changes" : "Add Card"}
          </Button>
          <Button type="button" variant="outline" className="flex-1" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
};
