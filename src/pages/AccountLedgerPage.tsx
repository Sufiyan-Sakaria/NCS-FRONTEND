import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format, isValid, parse, parseISO, subMonths } from "date-fns";
import { GetAllAccounts } from "@/api/api";
import { Account } from "@/Types/AccountType";
import { useNavigate } from "react-router-dom";

const AccountLedgerPage = () => {
  const {
    data: accounts,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["accounts"],
    queryFn: GetAllAccounts,
  });

  const [dateRange, setDateRange] = useState({
    from: format(subMonths(new Date(), 1), "dd-MM-yyyy"),
    to: format(new Date(), "dd-MM-yyyy"),
  });

  const navigate = useNavigate();

  const [account, setAccount] = useState<string>(""); // Selected account ID
  const [accountCode, setAccountCode] = useState<string>(""); // Manually entered account code

  const handleDateChange = (key: "from" | "to", value: string) => {
    const parsedDate = parseISO(value); // Directly parse ISO date format ("yyyy-MM-dd")

    if (!isValid(parsedDate)) {
      console.error("Invalid date:", value);
      return;
    }

    const formattedDate = format(parsedDate, "dd-MM-yyyy");
    setDateRange((prev) => ({ ...prev, [key]: formattedDate }));
  };

  const handleAccountChange = (value: string) => {
    setAccount(value);
    const selectedAccount = accounts.accounts.find(
      (acc: Account) => acc.id === value
    );
    setAccountCode(selectedAccount ? selectedAccount.code : "");
  };

  const handleCodeChange = (value: string) => {
    setAccountCode(value);
    const matchedAccount = accounts.accounts.find(
      (acc: Account) => acc.code === value
    );
    if (matchedAccount) {
      setAccount(matchedAccount.id);
    } else {
      setAccount("");
    }
  };

  const handleGenerate = () => {
    if (!account || !accountCode) return;

    const selectedAccount = accounts.accounts.find(
      (acc: Account) => acc.id === account
    );

    if (!selectedAccount) return;

    navigate(
      `${selectedAccount.id}?from=${dateRange.from}&to=${dateRange.to}`
    );
  };

  return (
    <main>
      <Card className="w-full max-w-md mx-auto mt-16 p-6 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-center">
            Account Ledger
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="font-medium">Account</Label>
              <div className="flex gap-2">
                <Input
                  className="w-2/5"
                  value={accountCode}
                  onChange={(e) => handleCodeChange(e.target.value)}
                  placeholder="Enter Account Code"
                />
                <Select value={account} onValueChange={handleAccountChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an account" />
                  </SelectTrigger>
                  <SelectContent>
                    {isLoading ? (
                      <SelectItem value="loading" disabled>
                        Loading...
                      </SelectItem>
                    ) : error ? (
                      <SelectItem value="error" disabled>
                        Error loading accounts
                      </SelectItem>
                    ) : (
                      accounts.accounts.map((acc: Account) => (
                        <SelectItem key={acc.id} value={acc.id}>
                          {acc.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="space-y-2 flex-1">
                <Label className="font-medium">From</Label>
                <Input
                  type="date"
                  value={format(parse(dateRange.from, "dd-MM-yyyy", new Date()), "yyyy-MM-dd")}
                  onChange={(e) => handleDateChange("from", e.target.value)}
                  className="w-full"
                />
              </div>
              <span className="text-gray-500 text-xl mt-5">-</span>
              <div className="space-y-2 flex-1">
                <Label className="font-medium">To</Label>
                <Input
                  type="date"
                  value={format(parse(dateRange.to, "dd-MM-yyyy", new Date()), "yyyy-MM-dd")}
                  onChange={(e) => handleDateChange("to", e.target.value)}
                  className="w-full"
                />
              </div>
            </div>
            <Button className="w-full" onClick={handleGenerate}>
              Generate Ledger
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
};

export default AccountLedgerPage;
