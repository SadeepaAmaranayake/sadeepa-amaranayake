// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query) => ({
    matches: query === '(prefers-reduced-motion: reduce)',
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

HTMLCanvasElement.prototype.getContext = () => ({
  beginPath: () => {},
  clearRect: () => {},
  closePath: () => {},
  createLinearGradient: () => ({ addColorStop: () => {} }),
  lineTo: () => {},
  moveTo: () => {},
  restore: () => {},
  save: () => {},
  setTransform: () => {},
  stroke: () => {},
});
