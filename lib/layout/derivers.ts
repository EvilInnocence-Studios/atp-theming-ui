import { memoize } from "ts-functional";
import { Func, Index } from "ts-functional/dist/types";

export declare interface IOperation {
    op: "context" | "startsWith" | "endsWith" | "contains" | "equals" | "notEquals" | "regex" | "notRegex" | "greaterThan" | "lessThan" | "greaterThanOrEqual" | "lessThanOrEqual" | "in" | "notIn" | "between" | "notBetween" | "null" | "notNull" | "empty" | "notEmpty" | "true" | "false";
    args: [Arg] | [Arg, Arg] | [Arg, Arg, Arg];
}

export declare type Arg = string | number | boolean | null | IOperation;

export const derivers: Index<IOperation | Func<any, any>> = {};

const isOperation = (arg: Arg): arg is IOperation => {
    return arg instanceof Object && 'op' in arg;
}

const evalOp = memoize((f: IOperation, context: Index<any>) => {
    const val1: any = isOperation(f.args[0])
        ? evalOp(f.args[0], context)
        : f.args[0] ? f.args[0] : undefined;
    const val2: any = f.args[1] && isOperation(f.args[1])
        ? evalOp(f.args[1], context)
        : f.args[1] ? f.args[1] : undefined;
    const val3: any = f.args[2] && isOperation(f.args[2])
        ? evalOp(f.args[2], context)
        : f.args[2] ? f.args[2] : undefined;

    switch (f.op) {
        case "context":
            return context[`${f.args[0]}`];
        case "startsWith":
            return `${val1}`.startsWith(`${val2}`);
        case "endsWith":
            return `${val1}`.endsWith(`${val2}`);
        case "contains":
            return val1.contains(val2);
        case "equals":
            return val1 === val2;
        case "notEquals":
            return val1 !== val2;
        case "regex":
            return val1.match(val2) !== null;
        case "notRegex":
            return val1.match(val2) === null;
        case "greaterThan":
            return val1 > val2;
        case "lessThan":
            return val1 < val2;
        case "greaterThanOrEqual":
            return val1 >= val2;
        case "lessThanOrEqual":
            return val1 <= val2;
        case "in":
            return val1 in val2;
        case "notIn":
            return !(val1 in val2);
        case "between":
            return val1 >= val2 && val1 <= val3;
        case "notBetween":
            return val1 < val2 || val1 > val3;
        case "null":
            return val1 === null;
        case "notNull":
            return val1 !== null;
        case "empty":
            return !val1;
        case "notEmpty":
            return !!val1;
        case "true":
            return !!val1;
        case "false":
            return !val1;
    }
}, {});

export const Derivers = {
    register: (name: string, deriver: IOperation | Func<any, any>) => {
        derivers[name] = deriver;
    },
    getAll: (): Index<IOperation | Func<any, any>> => derivers,
    get: (name: string): IOperation | Func<any, any> | undefined =>
        derivers[name],
    evaluate: (name: string, context: Index<any>) => {
        const deriver = derivers[name];
        if (deriver instanceof Function) {
            return deriver(context);
        } else {
            return evalOp(deriver, context);
        }
    },
    evaluateOperation: (operation: IOperation, context: Index<any>) => evalOp(operation, context),
    evaluateDeriver: (deriver: IOperation | Func<any, any>, context: Index<any>) => {
        if (deriver instanceof Function) {
            return deriver(context);
        } else {
            return evalOp(deriver, context);
        }
    },
}
