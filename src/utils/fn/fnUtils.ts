namespace FnUtils {
  export function throttle<T extends unknown[]>(callback: (...args: T) => void, wait = 300) {
    let isWaiting = false;
    let lastArgs: T;

    return (...args: T) => {
      if (isWaiting) {
        lastArgs = args;

        return;
      }

      callback(...args);
      isWaiting = true;

      setTimeout(() => {
        isWaiting = false;

        callback(...lastArgs);
      }, wait);
    };
  }
}

export default FnUtils;
