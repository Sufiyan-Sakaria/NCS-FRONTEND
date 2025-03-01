import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const LedgerPage = () => {
  return (
    <main>
      <Link to={"account"}>
        <Button>Account Ledger</Button>
      </Link>
    </main>
  );
};

export default LedgerPage;
