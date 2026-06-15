import type { Question } from "@/components/forms/types";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type MatrixValue = Record<string, Record<string, string>>;

type MatrixFieldProps = {
  question: Question;
  value: unknown;
  onChange: (nextValue: MatrixValue) => void;
  disabled?: boolean;
};

export function MatrixField({
  question,
  value,
  onChange,
  disabled = false,
}: MatrixFieldProps) {
  const matrixValue: MatrixValue =
    value && typeof value === "object" ? (value as MatrixValue) : {};
  const rows = question.matrixRows ?? [];
  const cols = question.matrixCols ?? [];

  const handleCellChange = (rowKey: string, colKey: string, next: string) => {
    onChange({
      ...matrixValue,
      [rowKey]: {
        ...(matrixValue[rowKey] ?? {}),
        [colKey]: next,
      },
    });
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="min-w-[220px]">Item</TableHead>
          {cols.map((col) => (
            <TableHead key={col.value}>{col.label.en}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.value}>
            <TableCell className="align-top">
              <p className="font-medium text-foreground">{row.label.en}</p>
              <p className="text-[11px] text-muted-foreground">{row.label.hi}</p>
            </TableCell>
            {cols.map((col) => (
              <TableCell key={`${row.value}-${col.value}`} className="min-w-[120px]">
                <Input
                  value={matrixValue[row.value]?.[col.value] ?? ""}
                  onChange={(event) =>
                    handleCellChange(row.value, col.value, event.target.value)
                  }
                  disabled={disabled}
                  placeholder="0"
                />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
