export const RESET_AUTOCOMPLATE = '[WRAPPER] RESET AUTOCOMPLATE';

export function resetAutoComplate(isReset) {
    return {
        type: RESET_AUTOCOMPLATE,
        isReset
    };
}
