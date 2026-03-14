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

  const pythonScript = `
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4

doc = SimpleDocTemplate("${safeInvoicePath}", pagesize=A4)
elements = []

styles = getSampleStyleSheet()

elements.append(Paragraph("<b>Build Your Best Self (BYBS)</b>", styles['Title']))
elements.append(Spacer(1, 12))

data = [
    ["Invoice Reference", "${order.reference}"],
    ["Customer Name", "${order.name}"],
    ["Customer Email", "${order.email}"],
    ["Product", "${order.product.title}"],
    ["Amount", "$${order.amount}"],
    ["Status", "Paid"]
]

table = Table(data, colWidths=[150, 300])

table.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,0), colors.whitesmoke),
    ('GRID', (0,0), (-1,-1), 1, colors.grey),
]))

elements.append(table)

doc.build(elements)
`;

  const scriptPath = path.join(invoiceDir, "temp_invoice.py");

  fs.writeFileSync(scriptPath, pythonScript);

  // QUOTE THE PATH to prevent Windows path issues
  execSync(`python "${scriptPath}"`, { stdio: "inherit" });

  fs.unlinkSync(scriptPath);

  return invoicePath;
};