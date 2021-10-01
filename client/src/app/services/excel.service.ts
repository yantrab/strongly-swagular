import * as XLSX from 'xlsx';
import { Injectable } from '@angular/core';
import { SheetJSONOpts } from 'xlsx';
import { cloneDeep } from 'lodash';
@Injectable()
export class ExcelService {
  private wopts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'binary' };

  writeFile(data: any[], fileName: string, options: { columns: { key: string; title: string }[] } & SheetJSONOpts): void {
    data = cloneDeep(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    const sheet = XLSX.utils.json_to_sheet([]);
    if (options.columns) {
      options.header = options.columns.map(c => c.title);
      data = data.map(objs => {
        Object.keys(objs).forEach(key => {
          const title = options.columns.find(c => c.key === key)?.title;
          if (!title) return;
          objs[title] = objs[key];
          delete objs[key];
        });
        return objs;
      });
      //  options.header = options.columns.map(c => c.title);
    }
    XLSX.utils.sheet_add_json(sheet, data, options);
    XLSX.utils.book_append_sheet(wb, sheet);
    /* save to file */
    const wbout: string = XLSX.write(wb, this.wopts);
    saveAs(new Blob([this.s2ab(wbout)]), fileName);
  }

  readFile<T>(arrayBuffer: ArrayBuffer, columns?: { key: string; title: string }[]): T[] {
    const data = new Uint8Array(arrayBuffer);
    const arr = new Array();
    for (let i = 0; i !== data.length; ++i) {
      arr[i] = String.fromCharCode(data[i]);
    }
    const bstr = arr.join('');

    const workbook = XLSX.read(bstr, { type: 'binary' });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    let result: T[] = XLSX.utils.sheet_to_json(worksheet, { raw: true });
    if (columns) {
      result = result.map((objs: any) => {
        Object.keys(objs).forEach(title => {
          const key = columns.find(c => c.title === title)?.key;
          if (!key) return;
          objs[key] = objs[title];
          delete objs[title];
        });
        return objs;
      });
    }
    return result;
  }

  private s2ab(s: string): ArrayBuffer {
    const buf: ArrayBuffer = new ArrayBuffer(s.length);
    const view: Uint8Array = new Uint8Array(buf);
    for (let i = 0; i !== s.length; ++i) {
      // eslint-disable-next-line no-bitwise
      view[i] = s.charCodeAt(i) & 0xff;
    }
    return buf;
  }
}
