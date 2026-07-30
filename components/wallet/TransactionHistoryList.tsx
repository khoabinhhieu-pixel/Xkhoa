import { formatVND } from "@/lib/format";

type TransactionItem = {
  id: string;
  type: string;
  amount: number;
  balanceAfter: number;
  description: string;
  createdAt: Date;
};

export default function TransactionHistoryList({
  transactions,
}: {
  transactions: TransactionItem[];
}) {
  if (transactions.length === 0) {
    return (
      <p className="text-sm text-fg-muted">Chưa có giao dịch nào trong ví.</p>
    );
  }

  return (
    <ul className="divide-y divide-border border-y border-border">
      {transactions.map((tx) => {
        const isTopup = tx.type === "TOPUP";
        return (
          <li key={tx.id} className="flex items-center justify-between gap-4 py-4">
            <div>
              <p className="text-sm text-fg">{tx.description}</p>
              <p className="mt-1 text-xs text-fg-muted">
                {new Date(tx.createdAt).toLocaleString("vi-VN")}
              </p>
            </div>
            <div className="shrink-0 text-right">
              <p className={`text-sm ${isTopup ? "text-fg" : "text-fg-muted"}`}>
                {isTopup ? "+" : ""}
                {formatVND(tx.amount)}
              </p>
              <p className="mt-1 text-xs text-fg-muted">
                Số dư: {formatVND(tx.balanceAfter)}
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
