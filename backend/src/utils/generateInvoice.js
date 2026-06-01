const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

exports.generateInvoice = async (order) => {

  const invoiceDir = path.join(__dirname, "../../invoices");

  if (!fs.existsSync(invoiceDir)) {
    fs.mkdirSync(invoiceDir, { recursive: true });
  }

  const invoicePath = path.join(
    invoiceDir,
    `invoice-${order.reference}.pdf`
  );

  // Python requires escaped backslashes on Windows
  const safeInvoicePath = invoicePath.replace(/\\/g, "\\\\");

  const invoiceItems = order.items?.length
    ? order.items.map((item) => ({
        title: item.title,
        quantity: item.quantity,
        price: item.price,
      }))
    : [
        {
          title: order.product.title,
          quantity: 1,
          price: order.amount,
        },
      ];

  const invoiceData = {
    reference: order.reference,
    name: order.name,
    email: order.email,
    amount: order.amount,
    items: invoiceItems,
  };

  const pythonScript = `
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
import json

doc = SimpleDocTemplate("${safeInvoicePath}", pagesize=A4)
elements = []

styles = getSampleStyleSheet()
invoice = json.loads(${JSON.stringify(JSON.stringify(invoiceData))})

elements.append(Paragraph("<b>Build Your Best Self (BYBS)</b>", styles['Title']))
elements.append(Spacer(1, 12))

data = [
    ["Invoice Reference", invoice["reference"]],
    ["Customer Name", invoice["name"]],
    ["Customer Email", invoice["email"]],
    ["Amount", "$" + format(invoice["amount"], ".2f")],
    ["Status", "Paid"]
]

table = Table(data, colWidths=[150, 300])

table.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,0), colors.whitesmoke),
    ('GRID', (0,0), (-1,-1), 1, colors.grey),
]))

elements.append(table)
elements.append(Spacer(1, 18))
elements.append(Paragraph("<b>Items</b>", styles['Heading2']))

item_data = [["Product", "Qty", "Price", "Subtotal"]]
for item in invoice["items"]:
    qty = item["quantity"]
    price = item["price"]
    item_data.append([
        item["title"],
        str(qty),
        "$" + format(price, ".2f"),
        "$" + format(price * qty, ".2f")
    ])

item_table = Table(item_data, colWidths=[250, 50, 90, 90])
item_table.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,0), colors.whitesmoke),
    ('GRID', (0,0), (-1,-1), 1, colors.grey),
]))

elements.append(item_table)

doc.build(elements)
`;

  const scriptPath = path.join(invoiceDir, "temp_invoice.py");

  fs.writeFileSync(scriptPath, pythonScript);

  // QUOTE THE PATH to prevent Windows path issues
  execSync(`python "${scriptPath}"`, { stdio: "inherit" });

  fs.unlinkSync(scriptPath);

  return invoicePath;
};
