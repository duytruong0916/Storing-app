import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class ImageService {
  public orientation;
  constructor() { };


  getOrientation(file, callback) {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file.slice(0, 64 * 1024));
    reader.onload = (event) => {
      var view = new DataView((event.target as any).result);
      if (view.getUint16(0, false) != 0xFFD8)
        return callback(-2,file);
      var length = view.byteLength,
        offset = 2;
      while (offset < length) {
        var marker = view.getUint16(offset, false);
        offset += 2;
        if (marker == 0xFFE1) {
          if (view.getUint32(offset += 2, false) != 0x45786966) {
           callback(-1,file);
          }
          var little = view.getUint16(offset += 6, false) == 0x4949;
          offset += view.getUint32(offset + 4, little);
          var tags = view.getUint16(offset, little);
          offset += 2;
          for (var i = 0; i < tags; i++)
            if (view.getUint16(offset + (i * 12), little) == 0x0112)
              return callback(view.getUint16(offset + (i * 12) + 8, little),file)
        }
        else if ((marker & 0xFF00) != 0xFF00) break;
        else offset += view.getUint16(offset, false);
      }
      return callback(-1,file);
    };
  };
  /*convert base64 to arraybuffer*/
  str2ab(str) {
    var buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
    var bufView = new Uint16Array(buf);
    for (var i = 0, strLen = str.length; i < strLen; i++) {
      bufView[i] = str.charCodeAt(i);
    }
    return buf;
  }
}

