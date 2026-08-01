import { CodeBlock } from "../components/CodeBlock";
import { DataDiagram } from "../components/DataDiagram";

/* ── DATA PROCESSING ──────────────────── */
export function DataProcessingSection() {
  return (
    <>
      <h2 id="data-processing">Data Processing</h2>
      <p>
        Data automation — cleaning, transforming, aggregating, and reporting — is where Python truly excels. The pandas + NumPy + openpyxl stack handles everything from a single CSV to millions of rows with the same readable API.
      </p>

      <DataDiagram />

      <h3>pandas — DataFrames for Everything</h3>
      <p>
        <code>pandas</code> turns tabular data into a <em>DataFrame</em>: a powerful in-memory structure with SQL-like operations built in. Read CSV, Excel, or SQL; clean missing values; filter rows; group by columns; merge datasets; write to any format. A task that would take 200 lines of manual Python takes 20 with pandas.
      </p>
      <CodeBlock
        filename="pandas_sales.py"
        note="Load, merge, clean and aggregate quarterly sales data"
        code={`import pandas as pd
from pathlib import Path

# Load and merge all four quarterly files
files = sorted(Path("data").glob("sales_Q*.csv"))
df = pd.concat([pd.read_csv(f) for f in files], ignore_index=True)

print(f"Loaded {len(df):,} rows from {len(files)} files")

# Clean and enrich
df["date"]    = pd.to_datetime(df["date"])
df["revenue"] = df["quantity"] * df["unit_price"]
df            = df[df["revenue"] > 0].copy()

# Aggregate: monthly revenue per product, top 10
monthly = (
    df.groupby([df["date"].dt.to_period("M"), "product"])["revenue"]
    .sum()
    .reset_index()
    .rename(columns={"date": "month"})
    .sort_values("revenue", ascending=False)
)

print("\\nTop 5 product-months by revenue:")
print(monthly.head(5).to_string(index=False))

monthly.to_csv("output/monthly_revenue.csv", index=False)
print("\\nExported to output/monthly_revenue.csv")`}
      />

      <h3>openpyxl — Excel Automation</h3>
      <p>
        When your stakeholders want a formatted Excel report — not a raw CSV — <code>openpyxl</code> lets you build it programmatically. Styled headers, conditional formatting, charts, and formula cells are all available from Python.
      </p>
      <CodeBlock
        filename="excel_report.py"
        note="Generate a formatted Excel report with openpyxl"
        code={`from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment

wb = Workbook()
ws = wb.active
ws.title = "Q2 Sales Report"

# Styled header row
headers = ["Product", "Units Sold", "Revenue ($)", "Growth (%)"]
fill    = PatternFill("solid", fgColor="4F46E5")
for col, text in enumerate(headers, 1):
    cell = ws.cell(row=1, column=col, value=text)
    cell.font      = Font(bold=True, color="FFFFFF", size=11)
    cell.fill      = fill
    cell.alignment = Alignment(horizontal="center")

# Data rows
data = [
    ("Widget Pro",  1250, 87500.00, 12.4),
    ("Widget Lite",  890, 35600.00,  8.2),
    ("Widget Max",   420, 63000.00, 24.7),
]
for row in data:
    ws.append(row)

# Auto-fit column widths
for col in ws.columns:
    max_w = max(len(str(c.value or "")) for c in col) + 3
    ws.column_dimensions[col[0].column_letter].width = max_w

wb.save("sales_report.xlsx")
print("Excel report generated: sales_report.xlsx")`}
      />
    </>
  );
}
