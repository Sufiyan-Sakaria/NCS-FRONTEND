import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

const VoucherPage = () => {
  return (
    <main>
      <Link to="receipt">
        <Button>
          <Plus />
          Cash Receipt Vocher
        </Button>
      </Link>
      <Link to="payment">
        <Button>
          <Plus />
          Cash Payment Vocher
        </Button>
      </Link>
    </main>
  );
};

export default VoucherPage;
