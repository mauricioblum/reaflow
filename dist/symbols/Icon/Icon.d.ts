import { FC } from 'react';
export interface IconProps {
    x: number;
    y: number;
    url: string;
    height: number;
    width: number;
    style?: any;
    className?: string;
}
export declare const Icon: FC<Partial<IconProps>>;
