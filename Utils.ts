function resolveAllBooleans(promises: Array<Promise<boolean>>): Promise<boolean> {
    return Promise.all(promises).then(
        (values: Array<boolean>): boolean => {
            return values.every((val, idx, arr) => val);
        },
        (reason: any): boolean => {
            return false;
        });
}

function roundUpTo(value: number, divisor: number): number {
    return Math.ceil(value / divisor) * divisor;
}

const BigIntMax = 9223372036854775807;