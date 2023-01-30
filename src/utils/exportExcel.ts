import FileSaver from 'file-saver'
import * as XLSX from 'xlsx'
import { write, utils } from 'xlsx'
const exportExcel = (elementId: string) => {
  let table = document.getElementById(elementId)
  let et = utils.table_to_book(table, { raw: true })
  console.log(et)
  let output = write(et, {
    bookType: 'csv',
    bookSST: true,
    type: 'array'
  })

  try {
    FileSaver.saveAs(new Blob([output], { type: 'application/octet-stream' }), `${Math.floor(Date.now() / 1000)}.csv`)
  } catch (e) {}

  return output
}
export default exportExcel
