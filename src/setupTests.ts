import '@testing-library/jest-dom';

// Add TextEncoder and TextDecoder for react-router
if (typeof TextEncoder === 'undefined') {
  global.TextEncoder = class TextEncoder {
    encode(str: string): Uint8Array {
      const arr = new Uint8Array(str.length);
      for (let i = 0; i < str.length; i++) {
        arr[i] = str.charCodeAt(i);
      }
      return arr;
    }
    encodeInto(str: string, u8arr: Uint8Array) {
      const arr = this.encode(str);
      u8arr.set(arr);
      return { read: str.length, written: arr.length };
    }
    get encoding() { return 'utf-8'; }
  } as typeof TextEncoder;
}

if (typeof TextDecoder === 'undefined') {
  global.TextDecoder = class implements TextDecoder {
    readonly encoding: string;
    readonly fatal: boolean;
    readonly ignoreBOM: boolean;

    constructor(label = 'utf-8', options: TextDecoderOptions = {}) {
      this.encoding = label;
      this.fatal = options.fatal ?? false;
      this.ignoreBOM = options.ignoreBOM ?? false;
    }

    decode(input?: BufferSource): string {
      if (!input) return '';
      const arr = input instanceof Uint8Array ? input : new Uint8Array(input as ArrayBuffer);
      return String.fromCharCode.apply(null, Array.from(arr));
    }
  } as typeof TextDecoder;
}

// Mock URL.createObjectURL and revokeObjectURL
window.URL.createObjectURL = jest.fn(() => 'mock-url');
window.URL.revokeObjectURL = jest.fn();

// Mock IntersectionObserver
class MockIntersectionObserver {
  observe = jest.fn();
  disconnect = jest.fn();
  unobserve = jest.fn();
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: MockIntersectionObserver
});

// Mock ResizeObserver
class MockResizeObserver {
  observe = jest.fn();
  disconnect = jest.fn();
  unobserve = jest.fn();
}

Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  configurable: true,
  value: MockResizeObserver
});
