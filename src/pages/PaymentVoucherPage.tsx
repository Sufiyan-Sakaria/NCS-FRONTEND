import { useEffect, useRef, useState } from "react";
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
import { CalendarIcon, Edit, LoaderCircle, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { GetVoucherNo, GetAllAccounts, CreateVoucher } from "@/api/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { useQueryClient } from "@tanstack/react-query";

const PaymentVoucherPage = () => {
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [voucherAccountId, setVoucherAccountId] = useState<string>("");
  const [voucherAccountCode, setVoucherAccountCode] = useState<string>("");
  const [entries, setEntries] = useState<
    {
      accountId: string;
      accountCode: string;
      amount: number;
      description: string;
      transactionType: string;
      voucherAccountId: string;
    }[]
  >([]);
  const [currentEntry, setCurrentEntry] = useState({
    accountId: "",
    accountCode: "",
    amount: "",
    description: "",
  });
  const [currentBalance, setCurrentBalance] = useState<number>(0);
  const [mainAccountBalance, setMainAccountBalance] = useState<number>(0);

  const voucherSelectTriggerRef = useRef<HTMLButtonElement>(null);
  const mainSelectTriggerRef = useRef<HTMLButtonElement>(null);
  const voucherCodeInputRef = useRef<HTMLInputElement>(null);
  const mainCodeInputRef = useRef<HTMLInputElement>(null);

  const queryClient = useQueryClient();

  // Fetch voucher number
  const {
    data: voucherNo,
    isLoading: isVoucherLoading,
    isError: isVoucherError,
  } = useQuery({
    queryKey: ["voucherNo", "Cash"],
    queryFn: () => GetVoucherNo("PAYMENT"),
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
      setVoucherAccountId(cashAndBankAccounts[0].id);
      setVoucherAccountCode(cashAndBankAccounts[0].code);
      setCurrentBalance(cashAndBankAccounts[0].currentBalance || 0);
    }
  }, [isSuccess, accounts]);

  // Handle F4 key press for voucher account
  const handleVoucherKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "F4") {
      e.preventDefault();
      if (voucherSelectTriggerRef.current) {
        voucherSelectTriggerRef.current.click();
      }
    }
  };

  // Handle F4 key press for main account
  const handleMainKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "F4") {
      e.preventDefault();
      if (mainSelectTriggerRef.current) {
        mainSelectTriggerRef.current.click();
      }
    }
  };

  // Handle Voucher Account selection via code input
  const handleVoucherCodeChange = (code: string) => {
    setVoucherAccountCode(code);

    // Find account by code
    const matchingAccount = cashAndBankAccounts?.find(
      (acc: any) => acc.code === code
    );
    if (matchingAccount) {
      setVoucherAccountId(matchingAccount.id);
    } else {
      setVoucherAccountId("");
    }
  };

  // Handle Main Account selection via code input
  const handleMainCodeChange = (code: string) => {
    setCurrentEntry((prev) => ({ ...prev, accountCode: code }));

    // Find account by code
    const matchingAccount = accounts?.accounts?.find(
      (acc: any) => acc.code === code
    );
    if (matchingAccount) {
      setCurrentEntry((prev) => ({
        ...prev,
        accountId: matchingAccount.id,
        accountCode: matchingAccount.code,
      }));
    } else {
      setCurrentEntry((prev) => ({ ...prev, accountId: "" }));
    }
  };

  // Handle Main Account selection via dropdown
  const handleMainAccountSelect = (accountId: string) => {
    const selectedAccount = accounts?.accounts?.find(
      (acc: any) => acc.id === accountId
    );
    if (selectedAccount) {
      setCurrentEntry((prev) => ({
        ...prev,
        accountId: selectedAccount.id,
        accountCode: selectedAccount.code,
      }));
      setMainAccountBalance(selectedAccount.currentBalance || 0);
    }
  };

  // Handle form submission for adding an entry
  const handleAddEntry = () => {
    if (!currentEntry.accountId || !currentEntry.amount || !voucherAccountId)
      return;

    const amount = parseFloat(currentEntry.amount);

    // Add DEBIT entry for the main account (PAYMENT)
    const debitEntry = {
      accountId: currentEntry.accountId,
      accountCode: currentEntry.accountCode,
      amount: amount,
      description: currentEntry.description,
      transactionType: "DEBIT",
      voucherAccountId: voucherAccountId,
    };

    // Add CREDIT entry for the voucher account (Cash/Bank)
    const creditEntry = {
      accountId: voucherAccountId,
      accountCode: voucherAccountCode,
      amount: amount,
      description: currentEntry.description,
      transactionType: "CREDIT",
      voucherAccountId: voucherAccountId,
    };

    setEntries([...entries, debitEntry, creditEntry]);
    setCurrentEntry({
      accountId: "",
      accountCode: "",
      amount: "",
      description: "",
    });
  };

  // Mutation to create voucher
  const createVoucherMutation = useMutation({
    mutationFn: CreateVoucher,
    onSuccess: () => {
      alert("Voucher created successfully!");
      setEntries([]);
      setCurrentEntry({
        accountId: "",
        accountCode: "",
        amount: "",
        description: "",
      });

      // Invalidate and refetch the accounts query
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
    onError: (error) => {
      alert(`Error creating voucher: ${error.message || "Unknown error"}`);
    },
  });

  // Handle final submission
  const handleSubmit = () => {
    if (entries.length < 2) {
      alert("Minimum 2 ledger entries are required.");
      return;
    }

    const ledgerEntries = entries.map((entry) => ({
      accountId: entry.accountId,
      transactionType: entry.transactionType,
      amount: entry.amount,
      description: entry.description,
    }));

    const voucherData = {
      voucherType: "PAYMENT",
      description: "Payment Voucher",
      totalAmount: entries
        .filter((entry) => entry.transactionType === "DEBIT")
        .reduce((sum, entry) => sum + entry.amount, 0),
      voucherAccId: voucherAccountId,
      ledgerEntries,
      date: format(date || new Date(), "dd-MM-yyyy"),
    };

    createVoucherMutation.mutate(voucherData);
  };

  // Filter entries to show only CREDIT entries (main account)
  const mainAccountEntries = entries.filter(
    (entry) => entry.transactionType === "DEBIT"
  );

  // Handle Edit Entry
  const handleEditEntry = (index: number) => {
    const entry = entries[index];
    setCurrentEntry({
      accountId: entry.accountId,
      accountCode: entry.accountCode,
      amount: entry.amount.toString(),
      description: entry.description,
    });
    setEditIndex(index);
  };

  // Handle Delete Entry
  const handleDeleteEntry = (index: number) => {
    setEntries((prev) => prev.filter((_, i) => i !== index && i !== index + 1));
  };

  // Handle Update Entry
  const handleUpdateEntry = () => {
    if (editIndex === null) return;

    const amount = parseFloat(currentEntry.amount);
    const updatedDebitEntry = {
      accountId: currentEntry.accountId,
      accountCode: currentEntry.accountCode,
      amount: amount,
      description: currentEntry.description,
      transactionType: "DEBIT",
      voucherAccountId: voucherAccountId,
    };

    const updatedCreditEntry = {
      accountId: voucherAccountId,
      accountCode: voucherAccountCode,
      amount: amount,
      description: currentEntry.description,
      transactionType: "CREDIT",
      voucherAccountId: voucherAccountId,
    };

    setEntries((prev) => {
      const newEntries = [...prev];
      newEntries[editIndex + 1] = updatedDebitEntry;
      newEntries[editIndex] = updatedCreditEntry;
      return newEntries;
    });

    setEditIndex(null);
    setCurrentEntry({
      accountId: "",
      accountCode: "",
      amount: "",
      description: "",
    });
  };

  return (
    <main className="flex justify-center min-h-screen p-2">
      <Card className="w-full mx-8">
        <CardHeader>
          <CardTitle>Cash Payment Voucher</CardTitle>
          <CardDescription>
            Enter the details for the cash payment.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Voucher Number & Date */}
          <main className="flex gap-6 justify-between">
            <div className="w-[43%] space-y-2">
              <div className="flex flex-col gap-2 justify-between">
                <div className="flex gap-2">
                  <div className="space-y-2 flex justify-end flex-col w-1/4">
                    <Label htmlFor="voucherno">Voucher No.</Label>
                    <Input
                      id="voucherno"
                      type="text"
                      value={
                        isVoucherLoading
                          ? "Loading..."
                          : isVoucherError
                          ? "Error!"
                          : voucherNo?.data.voucherNo || ""
                      }
                      readOnly
                      className="text-center"
                    />
                  </div>
                  <div className="space-y-2 flex justify-end flex-col w-3/4">
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
                </div>
              </div>
              {/* Voucher Account Section */}
              <div className="space-y-2">
                <div className="flex items-center gap-10">
                  <Label>Voucher Account (Cash/Bank)</Label>
                  {/* Display Current Balance with Dr./Cr. */}
                  {currentBalance !== undefined && (
                    <Label>
                      {Math.abs(currentBalance).toLocaleString()}{" "}
                      {currentBalance >= 0 ? "Dr." : "Cr."}
                    </Label>
                  )}
                </div>
                <div className="flex gap-2 items-center">
                  <div className="w-1/3">
                    <Input
                      ref={voucherCodeInputRef}
                      id="voucherAccountCode"
                      type="text"
                      placeholder="Enter code"
                      value={voucherAccountCode}
                      onChange={(e) => handleVoucherCodeChange(e.target.value)}
                      onKeyDown={handleVoucherKeyDown}
                    />
                  </div>
                  <Select
                    value={voucherAccountId}
                    onValueChange={(value) => {
                      setVoucherAccountId(value);
                      const selectedAccount = cashAndBankAccounts?.find(
                        (acc: any) => acc.id === value
                      );
                      if (selectedAccount) {
                        setVoucherAccountCode(selectedAccount.code);
                        setCurrentBalance(selectedAccount.currentBalance);
                      }
                    }}
                    disabled={isAccountsLoading || isAccountsError}
                  >
                    <SelectTrigger ref={voucherSelectTriggerRef}>
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
              {/* Main Account Section */}
              <div className="space-y-2">
                <div className="flex items-center gap-36">
                  <Label>Main Account</Label>
                  {/* Show Balance only if an account is selected */}
                  {currentEntry.accountId && mainAccountBalance !== null && (
                    <Label>
                      {Math.abs(mainAccountBalance).toLocaleString()}{" "}
                      {mainAccountBalance >= 0 ? "Dr." : "Cr."}
                    </Label>
                  )}
                </div>
                <div className="flex gap-2">
                  <div className="w-1/3">
                    <Input
                      ref={mainCodeInputRef}
                      id="mainAccountCode"
                      type="text"
                      placeholder="Enter code"
                      value={currentEntry.accountCode}
                      onChange={(e) => handleMainCodeChange(e.target.value)}
                      onKeyDown={handleMainKeyDown}
                    />
                  </div>
                  <Select
                    value={currentEntry.accountId}
                    onValueChange={handleMainAccountSelect}
                    disabled={isAccountsLoading || isAccountsError}
                  >
                    <SelectTrigger ref={mainSelectTriggerRef}>
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
              <div className="space-y-2">
                <Label htmlFor="amount">Debit Amount</Label>
                <Input
                  id="amount"
                  type="text"
                  placeholder="Enter amount"
                  value={currentEntry.amount.replace(
                    /\B(?=(\d{3})+(?!\d))/g,
                    ","
                  )}
                  onChange={(e) =>
                    setCurrentEntry((prev) => ({
                      ...prev,
                      amount: e.target.value.replace(/[^0-9]/g, ""),
                    }))
                  }
                  autoComplete="off"
                  className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="Enter a description (optional)"
                  value={currentEntry.description}
                  onChange={(e) =>
                    setCurrentEntry((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  autoComplete="off"
                />
              </div>
              {/* Buttons */}
              <div className="m-2 text-center">
                {editIndex !== null ? (
                  <Button onClick={handleUpdateEntry}>Update Entry</Button>
                ) : (
                  <Button onClick={handleAddEntry}>Add Entry</Button>
                )}
              </div>
            </div>
            <Separator orientation="vertical" className="h-96" />

            {/* Table of Entries */}
            <div className="rounded-md border select-none w-[57%]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center">Code</TableHead>
                    <TableHead className="text-center">Account</TableHead>
                    <TableHead className="text-center">
                      Voucher Account
                    </TableHead>
                    <TableHead className="text-center">Amount</TableHead>
                    <TableHead className="text-center">Description</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mainAccountEntries.map((entry, index) => (
                    <TableRow key={index}>
                      <TableCell className="text-center">
                        {entry.accountCode}
                      </TableCell>
                      <TableCell className="text-center">
                        {
                          accounts?.accounts?.find(
                            (acc: any) => acc.id === entry.accountId
                          )?.name
                        }
                      </TableCell>
                      <TableCell className="text-center">
                        {
                          cashAndBankAccounts?.find(
                            (acc: any) => acc.id === entry.voucherAccountId
                          )?.name
                        }
                      </TableCell>
                      <TableCell className="text-center">
                        {entry.amount.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-center">
                        {entry.description}
                      </TableCell>
                      <TableCell className="flex gap-1 items-center justify-center">
                        <Edit
                          onClick={() => handleEditEntry(index)}
                          className="text-green-500 cursor-pointer"
                        />
                        <Trash2
                          onClick={() => handleDeleteEntry(index)}
                          className="text-red-500 cursor-pointer"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </main>
          {/* Submit Button */}
          <div className="mt-4 text-center">
            <Button
              onClick={handleSubmit}
              disabled={createVoucherMutation.isPending}
            >
              {createVoucherMutation.isPending ? (
                <>
                  <LoaderCircle className="animate-spin mr-2" />
                  Submitting...
                </>
              ) : (
                "Submit Voucher"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
};

export default PaymentVoucherPage;
