import React, { FC, ReactElement } from 'react';
export interface AddProps {
    x: number;
    y: number;
    offsetX?: number;
    offsetY?: number;
    size?: number;
    className?: string;
    custom?: ReactElement;
    hidden?: boolean;
    onEnter?: (event: React.MouseEvent<SVGGElement, MouseEvent>) => void;
    onLeave?: (event: React.MouseEvent<SVGGElement, MouseEvent>) => void;
    onClick?: (event: React.MouseEvent<SVGGElement, MouseEvent>) => void;
}
export declare const Add: FC<Partial<AddProps>>;
