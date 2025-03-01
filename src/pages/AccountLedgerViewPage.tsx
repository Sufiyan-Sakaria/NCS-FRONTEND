import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { GetLedgerEntriesByAccountAndDateRange } from "@/api/api";
import { LedgerEntry } from "@/Types/LedgerType";
import { useParams, useSearchParams } from "react-router-dom";
import { DateTime } from "luxon";
import { format, parseISO } from "date-fns";

const AccountLedgerViewPage = () => {
    const { id } = useParams<{ id: string }>();
    const [searchParams] = useSearchParams();

    const from = searchParams.get("from") || "";
    const to = searchParams.get("to") || "";

    // Fetch ledger entries
    const { data: ledgerEntries, isLoading, error } = useQuery({
        queryKey: ["ledgerEntries", id, from, to],
        queryFn: () => (id && from && to ? GetLedgerEntriesByAccountAndDateRange(id, from, to) : Promise.reject("Missing params")),
        enabled: !!id && !!from && !!to,
    });

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading ledger entries</div>;

    console.log("Fetched ledger entries:", ledgerEntries);

    // Sort ledger entries to ensure "Opening Balance" is first
    const sortedEntries = ledgerEntries?.data.ledgers.sort((a: LedgerEntry, b: LedgerEntry) => {
        if (a.description === "Opening Balance") return -1;
        if (b.description === "Opening Balance") return 1;
        return DateTime.fromISO(a.date).toMillis() - DateTime.fromISO(b.date).toMillis();
    }) || [];

    // Compute balanceBefore directly without useEffect
    const balanceBefore = sortedEntries.length > 0 ? sortedEntries[0].previousBalance ?? 0 : 0;

    // Running balance calculation
    let runningBalance = balanceBefore;

    return (
        <main>
            <Card className="w-full max-w-4xl mx-auto mt-16 p-6 shadow-lg">
                <CardHeader>
                    <CardTitle className="text-2xl font-semibold text-center">
                        Account Ledger: {sortedEntries.length > 0 ? sortedEntries[0].account.name : "Unknown Account"}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-center">Date</TableHead>
                                <TableHead className="text-center">Particulars</TableHead>
                                <TableHead className="text-center">Debit</TableHead>
                                <TableHead className="text-center">Credit</TableHead>
                                <TableHead className="text-center">Balance</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {/* Show Balance B/f if previous balance exists */}
                            {balanceBefore !== 0 && (
                                <TableRow>
                                    <TableCell className="text-center">-</TableCell>
                                    <TableCell className="capitalize text-center font-semibold">Balance B/f</TableCell>
                                    <TableCell className="text-center">-</TableCell>
                                    <TableCell className="text-center">-</TableCell>
                                    <TableCell className="text-center">
                                        {balanceBefore.toLocaleString()} {balanceBefore >= 0 ? "Dr." : "Cr."}
                                    </TableCell>
                                </TableRow>
                            )}

                            {/* Ledger Entries */}
                            {sortedEntries.map((entry: LedgerEntry) => {
                                const amount = entry.amount;
                                if (entry.transactionType === "DEBIT") {
                                    runningBalance += amount;
                                } else {
                                    runningBalance -= amount;
                                }

                                return (
                                    <TableRow key={entry.id}>
                                        <TableCell className="text-center">{format(parseISO(entry.date), "dd/MM/yyyy")}</TableCell>
                                        <TableCell className="capitalize text-center">{entry.description}</TableCell>
                                        <TableCell className="text-center">
                                            {entry.transactionType === "DEBIT" ? amount.toLocaleString() : "-"}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {entry.transactionType === "CREDIT" ? amount.toLocaleString() : "-"}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {Math.abs(runningBalance).toLocaleString()} {runningBalance >= 0 ? "Dr." : "Cr."}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </main>
    );
};

export default AccountLedgerViewPage;
