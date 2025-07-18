export declare const inputCreateUserConfig: ({
    label: string;
    key: string;
    type: string;
    validation: {
        required: {
            value: boolean;
            message: string;
        };
        pattern?: undefined;
        minLength?: undefined;
    };
    options?: undefined;
} | {
    label: string;
    key: string;
    type: string;
    validation: {
        required: {
            value: boolean;
            message: string;
        };
        pattern: {
            value: RegExp;
            message: string;
        };
        minLength?: undefined;
    };
    options?: undefined;
} | {
    label: string;
    key: string;
    type: string;
    validation: {
        required: {
            value: boolean;
            message: string;
        };
        pattern?: undefined;
        minLength?: undefined;
    };
    options: string[];
} | {
    label: string;
    key: string;
    type: string;
    validation: {
        required: {
            value: boolean;
            message: string;
        };
        minLength: {
            value: number;
            message: string;
        };
        pattern?: undefined;
    };
    options?: undefined;
})[];
