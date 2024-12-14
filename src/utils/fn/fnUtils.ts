namespace FnUtils {
  export function throttle<T extends unknown[]>(callback: (...args: T) => void, wait = 300) {
    let isWaiting = false;

    return (...args: T) => {
      if (isWaiting) {
        return;
      }

      callback(...args);
      isWaiting = true;

      setTimeout(() => {
        isWaiting = false;
      }, wait);
    };
  }
}

export default FnUtils;
