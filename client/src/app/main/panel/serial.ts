import { EventHandlerVars } from '@angular/compiler/src/compiler_util/expression_converter';

export type SerialOptions = {
  baudRate?: number;
  dataBits?: number;
  stopBits?: number;
  parity?: string;
  bufferSize?: number;
  rtscts?: boolean;
  xon?: boolean;
  xoff?: boolean;
  xany?: boolean;
  filters?: any[];
  flowControl?: string;
};

interface SerialPortInfo {
  readonly serialNumber: string;
  readonly manufacturer: string;
  readonly locationId: string;
  readonly vendorId: string;
  readonly vendor: string;
  readonly productId: string;
  readonly product: string;
}

export interface SerialPort {
  readonly readable: ReadableStream;
  readonly writable: WritableStream;
  readonly in: ReadableStream;
  readonly out: WritableStream;

  open(options: SerialOptions): Promise<void>;

  close(): Promise<void>;

  getInfo(): SerialPortInfo;
}

declare global {
  interface Window {
    connect250: () => void;
    connectMtr4: () => void;
    connectEscan: () => void;
    disconnect250: () => void;
    disconnectMtr4: () => void;
    disconnectEscan: () => void;
  }

  interface Navigator {
    serial: {
      onconnect: EventHandlerVars;
      ondisconnect: EventHandlerVars;
      requestPort(options: SerialOptions): Promise<SerialPort>;
      getPorts(): Promise<Iterable<SerialPort>>;
    };
  }
}
