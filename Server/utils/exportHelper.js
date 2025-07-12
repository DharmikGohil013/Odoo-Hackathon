const { Parser } = require('json2csv');
const ExcelJS = require('exceljs');

// Export JSON data as CSV string
exports.exportToCSV = (data, fields, filename = 'export.csv', res) => {
  try {
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(data);

    res.header('Content-Type', 'text/csv');
    res.attachment(filename);
    return res.send(csv);
  } catch (err) {
    res.status(500).json({ message: 'CSV export error', error: err.message });
  }
};

// Export JSON data as downloadable Excel file
exports.exportToExcel = async (data, sheetName = 'Sheet1', filename = 'export.xlsx', res) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(sheetName);

    if (data.length === 0) {
      worksheet.addRow(['No Data']);
    } else {
      // Add headers
      worksheet.addRow(Object.keys(data[0]));
      // Add rows
      data.forEach(item => worksheet.addRow(Object.values(item)));
    }

    res.header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.attachment(filename);

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    res.status(500).json({ message: 'Excel export error', error: err.message });
  }
};
