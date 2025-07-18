export declare const inputServiceConfig: ({
    label: string;
    key: string;
    type: string;
    validation: {
        required: {
            value: boolean;
            message: string;
        };
        min?: undefined;
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
        min: {
            value: number;
            message: string;
        };
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
        min?: undefined;
    };
    options: string[];
})[];
