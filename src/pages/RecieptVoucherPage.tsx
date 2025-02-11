import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { GetVoucherNo, GetAccountByType } from "@/api/api";

const ReceiptVoucherPage = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [paymentMode, setPaymentMode] = useState("");
  const [selectedAccount, setSelectedAccount] = useState<string | undefined>();
  const [accountCode, setAccountCode] = useState("");

  // Fetch voucher number
  const {
    data: voucherNo,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["voucherNo", "Cash"],
    queryFn: () => GetVoucherNo("RECEIPT"),
  });

  // Fetch accounts list from backend
  const {
    data: accounts,
    isLoading: isAccountsLoading,
    isError: isAccountsError,
  } = useQuery({
    queryKey: ["accounts"],
    queryFn: () => GetAccountByType("CASH"),
    onSuccess: (data) => {
      if (data?.Accounts?.length > 0) {
        setSelectedAccount(data.Accounts[0].id);
        setAccountCode(data.Accounts[0].code);
      }
    },
  });

  // Handle account selection and set corresponding code
  const handleAccountSelect = (accountId: string) => {
    const selected = accounts?.Accounts?.find(
      (acc: any) => acc.id === accountId
    );
    if (selected) {
      setSelectedAccount(accountId); // Store the ID instead of name
      setAccountCode(selected.code);
    }
  };

  return (
    <main className="flex justify-center items-center min-h-screen p-4">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle>Cash Receipt Voucher</CardTitle>
          <CardDescription>
            Enter the details for the cash receipt.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Voucher Number & Date */}
          <div className="flex gap-4 justify-between">
            <div className="space-y-2 flex-1 w-1/2">
              <Label htmlFor="voucherno">Voucher No.</Label>
              <Input
                id="voucherno"
                type="text"
                value={
                  isLoading
                    ? "Loading..."
                    : isError
                    ? "Error!"
                    : voucherNo?.voucherNo || ""
                }
              />
            </div>
            <div className="space-y-2 flex justify-end flex-col w-1/2">
              <Label htmlFor="date">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2" />
                    {date ? format(date, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Account Section - Code & Selectable Name */}
          <div className="flex gap-4">
            <div className="space-y-2 w-1/4">
              <Label htmlFor="accountCode">Account Code</Label>
              <Input
                id="accountCode"
                type="text"
                value={accountCode}
                placeholder="Code"
                disabled
              />
            </div>
            <div className="space-y-2 w-3/4">
              <Label htmlFor="accountName">Account Name</Label>
              <Select
                value={selectedAccount}
                onValueChange={handleAccountSelect}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an account" />
                </SelectTrigger>
                <SelectContent>
                  {isAccountsLoading ? (
                    <SelectItem value="loading" disabled>
                      Loading...
                    </SelectItem>
                  ) : isAccountsError ? (
                    <SelectItem value="error" disabled>
                      Error fetching accounts
                    </SelectItem>
                  ) : (
                    accounts?.Accounts?.map((account: any) => (
                      <SelectItem key={account.id} value={account.id}>
                        {account.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input id="amount" type="number" placeholder="Enter amount" />
          </div>

          {/* Payment Mode */}
          <div className="space-y-2">
            <Label htmlFor="paymentMode">Payment Mode</Label>
            <Select value={paymentMode} onValueChange={setPaymentMode}>
              <SelectTrigger>
                <SelectValue placeholder="Select payment mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="bankTransfer">Bank Transfer</SelectItem>
                <SelectItem value="cheque">Cheque</SelectItem>
                <SelectItem value="online">Online Payment</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter a description (optional)"
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button>Submit</Button>
        </CardFooter>
      </Card>
    </main>
  );
};

export default ReceiptVoucherPage;
