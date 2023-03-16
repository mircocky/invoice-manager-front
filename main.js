
// **Google Sheet as database
const url = 'https://docs.google.com/spreadsheets/d/1DeqFo6-v4RdJ6j7Gf5pSqil6CG14lUqlyqAtB7dtHxI/edit#gid=0'
const ss = SpreadsheetApp.openByUrl(url)

// **Database Sheets
const ws = ss.getSheetByName("Users")
const clientUrl = ws.getRange(2,2).getValue()
const clientSs = SpreadsheetApp.openByUrl(clientUrl)
const clientInvoicesWs = clientSs.getSheetByName("Invoices")
const clientBusinessDetailsWs = clientSs.getSheetByName("BusinessDetails")


// const wholeData = ws.getRange(2, 1, ws.getLastRow()-1,ws.getLastColumn()).getValues(); //> [] To make it faster by chaning the first row to reduce the size of the whole data. 
// const sheetKeys = ws.getRange(1,1,1,ws.getLastColumn()).getValues(); // return []  will be used as keys for object. // head row

// const wsUsers = ss.getSheetByName("Users")
// const wholeDataUsers = wsUsers.getRange(2, 1, wsUsers.getLastRow()-1,wsUsers.getLastColumn()).getValues(); 

// const wsAddress = ss.getSheetByName("Address")
// const wholeDataAddress = wsAddress.getRange(2, 1, wsAddress.getLastRow()-1,wsAddress.getLastColumn()).getValues(); 


const doGet = () => {

    return HtmlService
    .createTemplateFromFile("index")
    .evaluate()
    .addMetaTag("viewport","width=device-width, initial-scale=1.0")
}  
 


const updateInvoiceData = (invoiceDetails) => {
  
var prevRef = clientInvoicesWs.getRange(clientInvoicesWs.getLastRow(), 1).getValue() 

if (!isNaN(parseFloat(prevRef)) && isFinite(prevRef) && prevRef >= 10000) {
  var invoiceNum = prevRef + 1
} else {
  var invoiceNum = 10000
}

console.log(invoiceDetails)

// invoiceDetails[0].billtoName, invoiceDetails[0].billtoFullAddress, invoiceDetails[0].billtoItems

clientInvoicesWs.appendRow(
  [
    invoiceNum,invoiceDetails[0].billtoEmail, invoiceDetails[0].billtoName,JSON.stringify([invoiceDetails[0].billtoFullAddress]), invoiceDetails[0].billtoContactNumber, 
    JSON.stringify(invoiceDetails[0].billtoItems), JSON.stringify(invoiceDetails[0].billingTotals), invoiceDetails[0].todayISO, invoiceDetails[0].duedateISO, 'Unpaid'
  ]
  );

return invoiceNum
}


const loadBusinessDetails = () => {
  const businessDetalsSheetKeys = clientBusinessDetailsWs.getRange(1,1,1,clientBusinessDetailsWs.getLastColumn()).getValues();
  const businessDetailsData = clientBusinessDetailsWs.getRange(2, 1, clientBusinessDetailsWs.getLastRow()-1,clientBusinessDetailsWs.getLastColumn()).getValues()

  let businessDetails = [];
  for (let i = 0; i < businessDetailsData.length; i++) {
    businessDetails[i] = businessDetalsSheetKeys[0].reduce((accumulator, element, index) => {
      return { ...accumulator, [element]: businessDetailsData[i][index] };
    }, {});
  }

  return businessDetails

}