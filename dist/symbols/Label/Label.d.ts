import { FC } from 'react';
export interface LabelProps {
    x: number;
    y: number;
    height: number;
    width: number;
    text: string;
    style?: any;
    className?: string;
    originalText?: string;
}
export declare const Label: FC<Partial<LabelProps>>;
