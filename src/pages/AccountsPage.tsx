import { GetAllAccounts } from "@/api/api";
import { useQuery } from "@tanstack/react-query";
import { TreeView, TreeDataItem } from "@/components/tree-view";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

// Define the type for an account
type Account = {
  id: string;
  name: string;
  code: string;
  groupId: string;
  accountType: string;
  currentBalance: number;
};

// Fetch accounts
const AccountsPage = () => {
  const {
    data: accountResponse,
    isLoading: isLoadingAccounts,
    error: errorAccounts,
  } = useQuery({
    queryKey: ["Accounts"],
    queryFn: GetAllAccounts,
    refetchInterval: 60 * 1000,
    staleTime: 60 * 1000,
  });

  const [selectedAccount, setSelectedAccount] = useState<TreeDataItem | null>(
    null
  );

  if (isLoadingAccounts) return <p>Loading accounts...</p>;
  if (errorAccounts)
    return <p>Error loading accounts: {errorAccounts.message}</p>;

  const accounts: Account[] = accountResponse?.data.data ?? [];

  return (
    <main className="flex h-screen">
      {/* Tree View Section */}
      <section className="w-[68%] px-2">
        <TreeView
          data={accounts}
          onSelectChange={(item) => setSelectedAccount(item || null)}
        />
      </section>
      {/* Account Details Section */}
      <section className="w-1/4 border-l fixed right-0 top-0 h-full shadow-lg">
        <h2 className="text-lg text-center font-bold m-3">Account Details</h2>
        {selectedAccount ? (
          <div className="flex flex-col gap-2 w-[90%] mx-4">
            <div className="grid gap-2">
              <Label htmlFor="accountName">Account Name</Label>
              <Input id="accountName" value={selectedAccount.name} />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="accountCode">Account Code</Label>
              </div>
              <Input id="accountCode" value={selectedAccount.code} />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="accountType">Account Type</Label>
              </div>
              <Input id="accountType" value={selectedAccount.accountType} />
            </div>
            {selectedAccount.currentBalance !== undefined && (
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="balance">Balance</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    id="balance"
                    value={Math.abs(selectedAccount.currentBalance)}
                    readOnly
                  />
                  <p className="font-semibold text-lg">
                    {selectedAccount.currentBalance >= 0 ? "Dr." : "Cr."}
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="text-secondary text-center">
            Select an account to see details
          </p>
        )}
      </section>
    </main>
  );
};

export default AccountsPage;
