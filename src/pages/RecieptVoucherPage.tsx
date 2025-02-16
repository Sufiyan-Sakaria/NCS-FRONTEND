import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
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
import { GetVoucherNo, GetAllAccounts, CreateVoucher } from "@/api/api";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ReceiptVoucherPage = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [paymentMode, setPaymentMode] = useState("");
  const [voucherAccountCode, setVoucherAccountCode] = useState("");
  const [voucherSelectedAccount, setVoucherSelectedAccount] = useState<
    string | undefined
  >();
  const [generalAccountCode, setGeneralAccountCode] = useState("");
  const [generalSelectedAccount, setGeneralSelectedAccount] = useState("");
  const [creditAmount, setCreditAmount] = useState("");
  const [description, setDescription] = useState("");
  const [entries, setEntries] = useState<any[]>([]);

  // Fetch voucher number
  const {
    data: voucherNo,
    isLoading: isVoucherLoading,
    isError: isVoucherError,
  } = useQuery({
    queryKey: ["voucherNo", "Cash"],
    queryFn: () => GetVoucherNo("RECEIPT"),
  });

  // Fetch accounts list
  const {
    data: accounts,
    isLoading: isAccountsLoading,
    isError: isAccountsError,
    isSuccess,
  } = useQuery({
    queryKey: ["accounts"],
    queryFn: () => GetAllAccounts(),
  });

  // Filter accounts for voucher selection (only Cash or Bank)
  const cashAndBankAccounts = accounts?.accounts?.filter(
    (acc: any) => acc.accountType === "CASH" || acc.accountType === "BANK"
  );

  // UseEffect to select first account by default when accounts are loaded
  useEffect(() => {
    if (isSuccess && cashAndBankAccounts?.length > 0) {
      setVoucherSelectedAccount(cashAndBankAccounts[0].id);
      setVoucherAccountCode(cashAndBankAccounts[0].code);
    }
  }, [isSuccess, accounts]);

  // Handle Voucher Account selection via dropdown
  const handleVoucherAccountSelect = (accountId: string) => {
    const selected = accounts?.accounts?.find(
      (acc: any) => acc.id === accountId
    );
    if (selected) {
      setVoucherSelectedAccount(accountId);
      setVoucherAccountCode(selected.code);
    }
  };

  // Handle Voucher Account selection via code input
  const handleVoucherCodeChange = (code: string) => {
    setVoucherAccountCode(code);

    // Find account by code
    const matchingAccount = accounts?.accounts?.find(
      (acc: any) => acc.code === code
    );
    if (matchingAccount) {
      setVoucherSelectedAccount(matchingAccount.id);
    } else {
      setVoucherSelectedAccount(undefined);
    }
  };

  // Handle General Account selection via dropdown
  const handleGeneralAccountSelect = (accountId: string) => {
    const selected = accounts?.accounts?.find(
      (acc: any) => acc.id === accountId
    );
    if (selected) {
      setGeneralSelectedAccount(accountId);
      setGeneralAccountCode(selected.code);
    }
  };

  // Handle General Account selection via code input
  const handleGeneralCodeChange = (code: string) => {
    setGeneralAccountCode(code);

    // Find account by code
    const matchingAccount = accounts?.accounts?.find(
      (acc: any) => acc.code === code
    );
    if (matchingAccount) {
      setGeneralSelectedAccount(matchingAccount.id);
    } else {
      setGeneralSelectedAccount("");
    }
  };

  // Handle form submission
  const handleAddEntry = () => {
    const newEntry = {
      code: generalAccountCode,
      account:
        accounts?.accounts?.find(
          (acc: any) => acc.id === generalSelectedAccount
        )?.name || "",
      amount: creditAmount,
      mode: paymentMode,
      description: description,
    };
    setEntries([...entries, newEntry]);

    // Reset form fields
    setCreditAmount("");
    setDescription("");
  };

  // Mutation to create voucher
  const createVoucherMutation = useMutation({
    mutationFn: CreateVoucher,
    onSuccess: () => {
      // Handle success
    },
    onError: (error) => {
      // Handle error
    },
  });

  // Handle final submission
  const handleSubmit = () => {
    const ledgerEntries = entries.map((entry) => ({
      accountId: generalSelectedAccount,
      transactionType: "CREDIT",
      amount: parseFloat(entry.amount),
      description: entry.description,
    }));

    const voucherData = {
      voucherType: "RECEIPT",
      description: "Receipt Voucher",
      ledgerEntries,
    };

    createVoucherMutation.mutate(voucherData);
  };

  return (
    <main className="flex justify-center min-h-screen p-2">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle>Cash Receipt Voucher</CardTitle>
          <CardDescription>
            Enter the details for the cash receipt.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Voucher Number & Date & Voucher Account */}
          <div className="flex flex-col gap-2 justify-between items-center">
            <div className="flex gap-2">
              <div className="space-y-2 flex justify-end flex-col w-[15%]">
                <Label htmlFor="voucherno">Voucher No.</Label>
                <Input
                  id="voucherno"
                  type="text"
                  value={
                    isVoucherLoading
                      ? "Loading..."
                      : isVoucherError
                      ? "Error!"
                      : voucherNo?.voucherNo || ""
                  }
                  readOnly
                />
              </div>
              <div className="space-y-2 flex justify-end flex-col w-1/4">
                <Label htmlFor="date">Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "justify-start font-normal text-center",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-1" />
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
              {/* Voucher Account Section - Only Cash & Bank Accounts */}
              <div className="flex gap-2 flex-col w-[65%]">
                <Label>Voucher Account Details</Label>
                <div className="flex gap-2">
                  <div className="w-1/3">
                    <Input
                      id="voucherAccountCode"
                      type="text"
                      value={voucherAccountCode}
                      placeholder="Enter code"
                      onChange={(e) => handleVoucherCodeChange(e.target.value)}
                    />
                  </div>
                  <Select
                    value={voucherSelectedAccount}
                    onValueChange={handleVoucherAccountSelect}
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
                        cashAndBankAccounts?.map((account: any) => (
                          <SelectItem key={account.id} value={account.id}>
                            {account.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <Separator />
          </div>

          {/* General Account Selection (All Accounts) */}
          <div className="space-y-1">
            <Label>Select Account</Label>
            <div className="flex gap-2">
              <div>
                <Input
                  id="generalAccountCode"
                  type="text"
                  value={generalAccountCode}
                  placeholder="Enter code"
                  onChange={(e) => handleGeneralCodeChange(e.target.value)}
                />
              </div>
              <Select
                value={generalSelectedAccount}
                onValueChange={handleGeneralAccountSelect}
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
                    accounts?.accounts?.map((account: any) => (
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
          <div className="flex gap-2">
            <div className="space-y-1 w-1/2">
              <Label htmlFor="amount">Credit Amount</Label>
              <Input
                id="amount"
                type="text" // Change type to "text" to remove increment/decrement arrows
                placeholder="Enter amount"
                value={creditAmount.replace(/\B(?=(\d{3})+(?!\d))/g, ",")} // Format with commas
                onChange={(e) => {
                  // Remove commas and non-numeric characters
                  const rawValue = e.target.value.replace(/[^0-9]/g, "");
                  setCreditAmount(rawValue); // Store raw numeric value in state
                }}
                autoComplete="off"
                className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" // Hide arrows
              />
            </div>
            {/* Payment Mode */}
            <div className="space-y-1 w-1/2">
              <Label htmlFor="paymentMode">Payment Mode</Label>
              <Select value={paymentMode} onValueChange={setPaymentMode}>
                <SelectTrigger>
                  <SelectValue placeholder="Select payment mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="bank Transfer">Bank Transfer</SelectItem>
                  <SelectItem value="cheque">Cheque</SelectItem>
                  <SelectItem value="online">Online Payment</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="Enter a description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              autoComplete="off"
            />
          </div>

          {/* Add Entry Button */}
          <div className="m-2 text-center">
            <Button onClick={handleAddEntry}>Add Entry</Button>
          </div>

          {/* Table of Entries */}
          <div className="rounded-md border select-none">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">Code</TableHead>
                  <TableHead className="text-center">Account</TableHead>
                  <TableHead className="text-center">Amount</TableHead>
                  <TableHead className="text-center">Mode</TableHead>
                  <TableHead className="text-center">Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.map((entry, index) => (
                  <TableRow key={index}>
                    <TableCell className="text-center">{entry.code}</TableCell>
                    <TableCell className="text-center">
                      {entry.account}
                    </TableCell>
                    <TableCell className="text-center">
                      {Number(entry.amount).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-center capitalize">
                      {entry.mode}
                    </TableCell>
                    <TableCell className="text-center">
                      {entry.description}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Submit Button */}
          <div className="mt-4 text-center">
            <Button
              onClick={handleSubmit}
              disabled={createVoucherMutation.isPending}
            >
              {createVoucherMutation.isPending
                ? "Submitting..."
                : "Submit Voucher"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
};

export default ReceiptVoucherPage;
