declare namespace FnUtils {
    function throttle<T extends unknown[]>(callback: (...args: T) => void, wait?: number): (...args: T) => void;
}
export default FnUtils;
